import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthTokenType } from '../../generated/prisma/enums';
import { UserEmailChangeService } from '../user-email-change.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { MailService } from '../../mail/mail.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';

describe('UserEmailChangeService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let mailService: { sendEmailChangeConfirmOld: jest.Mock; sendEmailChangeConfirmNew: jest.Mock };
  let userSettingsService: {
    setPendingEmailChange: jest.Mock;
    markEmailChangeConfirmation: jest.Mock;
    clearPendingEmailChange: jest.Mock;
    revokeAllSessions: jest.Mock;
    getPendingEmailChange: jest.Mock;
    allowsSecurityEmail: jest.Mock;
  };
  let service: UserEmailChangeService;

  beforeEach(() => {
    prisma = createPrismaMock();
    mailService = {
      sendEmailChangeConfirmOld: jest.fn().mockResolvedValue(undefined),
      sendEmailChangeConfirmNew: jest.fn().mockResolvedValue(undefined),
    };
    userSettingsService = {
      setPendingEmailChange: jest.fn().mockResolvedValue(undefined),
      markEmailChangeConfirmation: jest.fn(),
      clearPendingEmailChange: jest.fn().mockResolvedValue(undefined),
      revokeAllSessions: jest.fn().mockResolvedValue(undefined),
      getPendingEmailChange: jest.fn().mockResolvedValue(null),
      allowsSecurityEmail: jest.fn().mockResolvedValue(true),
    };
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'SERVER_URL') return 'http://localhost:3000';
        return undefined;
      }),
    };
    service = new UserEmailChangeService(
      prisma as never,
      mailService as unknown as MailService,
      configService as unknown as ConfigService,
      userSettingsService as unknown as UserSettingsService,
    );
  });

  it('rejects when new email equals current', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      passwordHash: 'hash',
    });
    await expect(
      service.requestChange(1, 'a@b.com', 'pass'),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates two tokens and sends mails', async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce({ id: 1, email: 'old@b.com', passwordHash: null })
      .mockResolvedValueOnce(null);
    prisma.authToken.deleteMany.mockResolvedValue({ count: 0 });
    prisma.authToken.createMany.mockResolvedValue({ count: 2 });
    prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

    const result = await service.requestChange(1, 'new@b.com', undefined);
    expect(result.ok).toBe(true);
    expect(prisma.authToken.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ type: AuthTokenType.EMAIL_CHANGE_OLD }),
          expect.objectContaining({ type: AuthTokenType.EMAIL_CHANGE_NEW }),
        ]),
      }),
    );
    expect(mailService.sendEmailChangeConfirmOld).toHaveBeenCalled();
    expect(mailService.sendEmailChangeConfirmNew).toHaveBeenCalled();
  });
});
