"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = require("@sendgrid/mail");
let MailService = class MailService {
    configService;
    constructor(configService) {
        this.configService = configService;
        const key = this.configService.get('SENDGRID_API_KEY')?.trim();
        const from = this.configService.get('MAIL_FROM')?.trim();
        if (!key) {
            throw new Error('SENDGRID_API_KEY is required for outgoing mail (SendGrid Web API).');
        }
        if (!from) {
            throw new Error('MAIL_FROM is required (verified sender in SendGrid).');
        }
        sgMail.setApiKey(key);
    }
    async sendEmailVerification(to, verificationUrl) {
        const subject = 'Подтвердите email';
        const text = `Перейдите по ссылке для подтверждения email: ${verificationUrl}`;
        const html = this.getEmailVerificationHtmlTemplate(verificationUrl);
        return this.sendOutgoing(to, subject, text, html);
    }
    async sendPasswordReset(to, resetUrl) {
        const subject = 'Сброс пароля';
        const text = `Перейдите по ссылке для сброса пароля: ${resetUrl}`;
        const html = this.getResetPasswordHtmlTemplate(resetUrl);
        return this.sendOutgoing(to, subject, text, html);
    }
    async sendWorkspaceInvite(to, inviteUrl, workspaceName) {
        const subject = 'Приглашение в рабочее пространство';
        const namePlain = workspaceName.trim() || 'рабочее пространство';
        const nameHtml = this.escapeHtml(namePlain);
        const text = `Вас пригласили присоединиться к рабочему пространству «${namePlain}».\n\nЧтобы принять приглашение, откройте ссылку в браузере:\n${inviteUrl}`;
        const html = this.getWorkspaceInviteHtmlTemplate(inviteUrl, nameHtml);
        return this.sendOutgoing(to, subject, text, html);
    }
    getMailFrom() {
        const from = this.configService.get('MAIL_FROM')?.trim();
        if (!from) {
            throw new Error('MAIL_FROM must be set for outgoing mail.');
        }
        return from;
    }
    async sendOutgoing(to, subject, text, html) {
        await sgMail.send({
            to,
            from: this.getMailFrom(),
            subject,
            text,
            html,
        });
    }
    escapeHtml(s) {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    getEmailVerificationHtmlTemplate(verificationUrl) {
        return `
      <p>Для подтверждения email нажмите <a href="${verificationUrl}">сюда</a>.</p>
      <p>Если вы не запрашивали это письмо, проигнорируйте его.</p>
    `;
    }
    getResetPasswordHtmlTemplate(resetUrl) {
        return `
      <p>Для сброса пароля нажмите <a href="${resetUrl}">сюда</a>.</p>
      <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
    `;
    }
    getWorkspaceInviteHtmlTemplate(inviteUrl, workspaceNameEscaped) {
        const btn = 'display:inline-block;padding:8px 16px;background:#2563eb;color:#ffffff !important;' +
            'text-decoration:none;border-radius:6px;font:600 14px/1.3 system-ui,-apple-system,sans-serif;';
        return `
      <p style="margin:0 0 16px;font:16px/1.5 system-ui,-apple-system,sans-serif;color:#111;">
        Вас пригласили присоединиться к рабочему пространству «${workspaceNameEscaped}».
      </p>
      <p style="margin:0;">
        <a href="${inviteUrl}" style="${btn}">Принять приглашение</a>
      </p>
    `;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map