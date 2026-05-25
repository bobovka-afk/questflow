import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendEmailVerification(to: string, verificationUrl: string): Promise<void>;
    sendPasswordReset(to: string, resetUrl: string): Promise<void>;
    sendWorkspaceInvite(to: string, inviteUrl: string, workspaceName: string): Promise<void>;
    private getMailFrom;
    private sendOutgoing;
    private escapeHtml;
    private getEmailVerificationHtmlTemplate;
    private getResetPasswordHtmlTemplate;
    private getWorkspaceInviteHtmlTemplate;
}
