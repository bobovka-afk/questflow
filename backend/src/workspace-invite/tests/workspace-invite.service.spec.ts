import { ConflictException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { WorkspaceRole } from '../../generated/prisma/enums';
import { WorkspaceInviteService } from '../workspace-invite.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { WorkspaceService } from '../../workspace/workspace.service';
import { WorkspaceActivityService } from '../../workspace-activity/workspace-activity.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceInviteService', () => {
  let service: WorkspaceInviteService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new WorkspaceInviteService(
      prisma as unknown as PrismaService,
      { sendWorkspaceInvite: jest.fn() } as unknown as MailService,
      { get: jest.fn().mockReturnValue('http://app.test') } as unknown as ConfigService,
      {} as unknown as WorkspaceService,
      { record: jest.fn() } as unknown as WorkspaceActivityService,
    );
  });

  it('sendInvite rejects existing member', async () => {
    prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
    prisma.workspaceMember!.findUnique!.mockResolvedValue({ id: 1 });
    await expect(
      service.sendInvite(
        { email: 'a@b.com', role: WorkspaceRole.MEMBER },
        1,
        10,
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('sendInvite maps duplicate invite to conflict', async () => {
    prisma.user!.findUnique!.mockResolvedValue(null);
    const err = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: 'test',
    });
    prisma.workspaceInvite!.create!.mockRejectedValue(err);
    await expect(
      service.sendInvite(
        { email: 'a@b.com', role: WorkspaceRole.MEMBER },
        1,
        10,
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('sendInvite creates invite and sends mail', async () => {
    prisma.user!.findUnique!.mockResolvedValue(null);
    prisma.workspaceInvite!.create!.mockResolvedValue({ id: 99 });
    prisma.workspace!.findUnique!.mockResolvedValue({ name: 'Team' });
    const mail = { sendWorkspaceInvite: jest.fn().mockResolvedValue(undefined) };
    const activity = { record: jest.fn() };
    const svc = new WorkspaceInviteService(
      prisma as unknown as PrismaService,
      mail as unknown as MailService,
      { get: jest.fn().mockReturnValue('http://app.test') } as unknown as ConfigService,
      {} as unknown as WorkspaceService,
      activity as unknown as WorkspaceActivityService,
    );
    await expect(
      svc.sendInvite(
        { email: 'new@b.com', role: WorkspaceRole.MEMBER },
        1,
        10,
      ),
    ).resolves.toEqual({ id: 99 });
    expect(mail.sendWorkspaceInvite).toHaveBeenCalled();
  });

  it('getWorkspaceInvites lists pending invites', async () => {
    prisma.workspaceInvite!.findMany!.mockResolvedValue([]);
    await service.getWorkspaceInvites(1, { limit: 5, offset: 0 });
    expect(prisma.workspaceInvite!.findMany).toHaveBeenCalled();
  });

  it('deleteInvite removes invite in transaction', async () => {
    const tx = {
      workspaceInvite: {
        findFirst: jest.fn().mockResolvedValue({
          id: 1,
          email: 'a@b.com',
          role: WorkspaceRole.MEMBER,
        }),
        delete: jest.fn(),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(service.deleteInvite(1, 10, 2)).resolves.toEqual({ ok: true });
  });
});
