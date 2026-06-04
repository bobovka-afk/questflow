import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../../user/user.service'
import { UserSettingsService } from '../../user-settings/user-settings.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService,
		private userSettingsService: UserSettingsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET') || 'secret'
		})
	}

	async validate(payload: { id: string; sid?: string }) {
		const user = await this.userService.getById(payload.id)
		if (!user) return null

		if (payload.sid) {
			const active = await this.userSettingsService.isSessionActive(user.id, payload.sid)
			if (!active) {
				throw new UnauthorizedException({
					code: 'SESSION_REVOKED',
					message: 'Session has been revoked',
				})
			}
		}

		void this.userService.touchLastActive(user.id).catch(() => undefined)

		return { ...user, sessionId: payload.sid }
	}
}