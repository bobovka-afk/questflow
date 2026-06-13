import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
	constructor(private readonly configService: ConfigService) {
		const key = this.configService.get<string>('SENDGRID_API_KEY')?.trim();
		const from = this.configService.get<string>('MAIL_FROM')?.trim();
		if (!key) {
			throw new Error(
				'SENDGRID_API_KEY is required for outgoing mail (SendGrid Web API).',
			);
		}
		if (!from) {
			throw new Error(
				'MAIL_FROM is required (verified sender in SendGrid).',
			);
		}
		sgMail.setApiKey(key);
	}

	async sendEmailVerification(to: string, verificationUrl: string) {
		const subject = 'Confirm your email';
		const text = `Follow this link to verify your email: ${verificationUrl}`;
		const html = this.getEmailVerificationHtmlTemplate(verificationUrl);

		return this.sendOutgoing(to, subject, text, html);
	}

	async sendPasswordReset(to: string, resetUrl: string) {
		const subject = 'Reset your password';
		const text = `Follow this link to reset your password: ${resetUrl}`;
		const html = this.getResetPasswordHtmlTemplate(resetUrl);

		return this.sendOutgoing(to, subject, text, html);
	}

	async sendEmailChangeConfirmOld(
		to: string,
		confirmUrl: string,
		newEmail: string,
	) {
		const subject = 'Confirm email change';
		const text = `An email change to ${newEmail} was requested. Confirm from your current address: ${confirmUrl}`;
		const html = `
      <p>A change to <strong>${this.escapeHtml(newEmail)}</strong> was requested.</p>
      <p>If this was you, confirm from your <a href="${confirmUrl}">current email</a>.</p>
      <p>Otherwise, ignore this message.</p>
    `;
		return this.sendOutgoing(to, subject, text, html);
	}

	async sendEmailChangeConfirmNew(to: string, confirmUrl: string) {
		const subject = 'Confirm your new email';
		const text = `Confirm your new address: ${confirmUrl}`;
		const html = `
      <p>Confirm your new email: <a href="${confirmUrl}">continue</a>.</p>
      <p>If you did not request this change, ignore this message.</p>
    `;
		return this.sendOutgoing(to, subject, text, html);
	}

	async sendWorkspaceInvite(
		to: string,
		inviteUrl: string,
		workspaceName: string,
	) {
		const subject = 'Workspace invitation';
		const namePlain = workspaceName.trim() || 'workspace';
		const nameHtml = this.escapeHtml(namePlain);
		const text = `You were invited to join the workspace "${namePlain}".\n\nTo accept, open this link in your browser:\n${inviteUrl}`;
		const html = this.getWorkspaceInviteHtmlTemplate(inviteUrl, nameHtml);

		return this.sendOutgoing(to, subject, text, html);
	}

	private getMailFrom(): string {
		const from = this.configService.get<string>('MAIL_FROM')?.trim();
		if (!from) {
			throw new Error('MAIL_FROM must be set for outgoing mail.');
		}
		return from;
	}

	private async sendOutgoing(
		to: string,
		subject: string,
		text: string,
		html: string,
	) {
		await sgMail.send({
			to,
			from: this.getMailFrom(),
			subject,
			text,
			html,
		});
	}

	private escapeHtml(s: string): string {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	private getEmailVerificationHtmlTemplate(verificationUrl: string): string {
		return `
      <p>To verify your email, click <a href="${verificationUrl}">here</a>.</p>
      <p>If you did not request this email, ignore it.</p>
    `;
	}

	private getResetPasswordHtmlTemplate(resetUrl: string): string {
		return `
      <p>To reset your password, click <a href="${resetUrl}">here</a>.</p>
      <p>If you did not request a password reset, ignore this message.</p>
    `;
	}

	private getWorkspaceInviteHtmlTemplate(
		inviteUrl: string,
		workspaceNameEscaped: string,
	): string {
		const btn =
			'display:inline-block;padding:8px 16px;background:#2563eb;color:#ffffff !important;' +
			'text-decoration:none;border-radius:6px;font:600 14px/1.3 system-ui,-apple-system,sans-serif;';
		return `
      <p style="margin:0 0 16px;font:16px/1.5 system-ui,-apple-system,sans-serif;color:#111;">
        You were invited to join the workspace "${workspaceNameEscaped}".
      </p>
      <p style="margin:0;">
        <a href="${inviteUrl}" style="${btn}">Accept invitation</a>
      </p>
    `;
	}
}
