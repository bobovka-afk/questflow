import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthTokenType, UserSecurityEventType } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import type { SessionRequestMeta } from '../user-settings/interface';

@Injectable()
export class UserEmailChangeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async requestChange(
    userId: number,
    newEmail: string,
    currentPassword: string | undefined,
    meta?: SessionRequestMeta,
  ): Promise<{ ok: boolean }> {
    const normalizedNew = this.normalizeEmail(newEmail);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, passwordHash: true },
    });
    if (!user) {
      throw new BadRequestException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (normalizedNew === user.email) {
      throw new BadRequestException({
        code: 'EMAIL_UNCHANGED',
        message: 'New email must differ from current email',
      });
    }

    const taken = await this.prisma.user.findUnique({
      where: { email: normalizedNew },
      select: { id: true },
    });
    if (taken) {
      throw new BadRequestException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'User with this email already exists',
      });
    }

    if (user.passwordHash) {
      if (!currentPassword) {
        throw new BadRequestException({
          code: 'CURRENT_PASSWORD_REQUIRED',
          message: 'Current password is required',
        });
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException({
          code: 'INVALID_CURRENT_PASSWORD',
          message: 'Current password is invalid',
        });
      }
    }

    await this.prisma.authToken.deleteMany({
      where: {
        userId,
        type: { in: [AuthTokenType.EMAIL_CHANGE_OLD, AuthTokenType.EMAIL_CHANGE_NEW] },
        usedAt: null,
      },
    });

    await this.userSettingsService.setPendingEmailChange(userId, normalizedNew);

    const oldToken = this.generateToken();
    const newToken = this.generateToken();
    const expiresAt = new Date(Date.now() + this.getEmailChangeTtlMs());

    await this.prisma.authToken.createMany({
      data: [
        {
          userId,
          type: AuthTokenType.EMAIL_CHANGE_OLD,
          tokenHash: this.hashToken(oldToken),
          expiresAt,
        },
        {
          userId,
          type: AuthTokenType.EMAIL_CHANGE_NEW,
          tokenHash: this.hashToken(newToken),
          expiresAt,
        },
      ],
    });

    const serverUrl = this.configService.get<string>('SERVER_URL') || '';
    const oldUrl = `${serverUrl}/auth/email-change/confirm?token=${oldToken}`;
    const newUrl = `${serverUrl}/auth/email-change/confirm?token=${newToken}`;

    if (await this.userSettingsService.allowsSecurityEmail(userId)) {
      await this.mailService.sendEmailChangeConfirmOld(user.email, oldUrl, normalizedNew);
      await this.mailService.sendEmailChangeConfirmNew(normalizedNew, newUrl);
    }

    await this.prisma.userSecurityEvent.create({
      data: {
        userId,
        type: UserSecurityEventType.EMAIL_CHANGE_REQUESTED,
        metadata: { newEmail: normalizedNew },
        ipAddress: meta?.ipAddress ?? null,
        userAgent: meta?.userAgent ?? null,
      },
    });

    return { ok: true };
  }

  async confirmToken(token: string): Promise<{ ok: boolean; completed: boolean }> {
    if (!token) {
      throw new BadRequestException({
        code: 'TOKEN_REQUIRED',
        message: 'Token is required',
      });
    }

    const tokenHash = this.hashToken(token);
    const authToken = await this.prisma.authToken.findUnique({
      where: { tokenHash },
    });

    const now = new Date();
    const isValid =
      authToken &&
      (authToken.type === AuthTokenType.EMAIL_CHANGE_OLD ||
        authToken.type === AuthTokenType.EMAIL_CHANGE_NEW) &&
      !authToken.usedAt &&
      authToken.expiresAt > now;

    if (!isValid || !authToken) {
      throw new BadRequestException({
        code: 'TOKEN_INVALID_OR_EXPIRED',
        message: 'Token is invalid or expired',
      });
    }

    const side =
      authToken.type === AuthTokenType.EMAIL_CHANGE_OLD ? 'old' : 'new';

    await this.prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: now },
    });

    const status = await this.userSettingsService.markEmailChangeConfirmation(
      authToken.userId,
      side,
    );

    if (!status.newEmail || !status.oldConfirmed || !status.newConfirmed) {
      return { ok: true, completed: false };
    }

    await this.completeEmailChange(authToken.userId, status.newEmail);
    return { ok: true, completed: true };
  }

  async getPendingStatus(userId: number) {
    const pending = await this.userSettingsService.getPendingEmailChange(userId);
    if (!pending) return null;
    return {
      newEmail: pending.newEmail,
      oldConfirmed: Boolean(pending.oldConfirmedAt),
      newConfirmed: Boolean(pending.newConfirmedAt),
      requestedAt: pending.requestedAt,
    };
  }

  private async completeEmailChange(userId: number, newEmail: string) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          email: newEmail,
          emailVerifiedAt: new Date(),
        },
      }),
      this.prisma.authToken.deleteMany({
        where: {
          userId,
          type: { in: [AuthTokenType.EMAIL_CHANGE_OLD, AuthTokenType.EMAIL_CHANGE_NEW] },
        },
      }),
    ]);

    await this.userSettingsService.clearPendingEmailChange(userId);
    await this.userSettingsService.revokeAllSessions(userId);

    await this.prisma.userSecurityEvent.create({
      data: {
        userId,
        type: UserSecurityEventType.EMAIL_CHANGED,
        metadata: { newEmail },
      },
    });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getEmailChangeTtlMs() {
    const minutes =
      Number(this.configService.get('EMAIL_CHANGE_TTL_MINUTES')) || 60;
    return minutes * 60 * 1000;
  }
}
