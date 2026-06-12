import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceInviteModule } from './workspace-invite/workspace-invite.module';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { CharacterModule } from './character/character.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GamificationModule } from './gamification/gamification.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { SocialModule } from './social/social.module';
import { PartyModule } from './party/party.module';
import { NotificationModule } from './notification/notification.module';
import { PersonalModule } from './personal/personal.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        quietReqLogger: true,
        quietResLogger: true,
        genReqId: (req, res) => {
          const incomingRequestId = req.headers['x-request-id'];
          const requestId = Array.isArray(incomingRequestId)
            ? incomingRequestId[0]
            : incomingRequestId ?? randomUUID();

          res.setHeader('X-Request-Id', requestId);
          return requestId;
        },
        customProps: (req) => ({
          requestId: req.id,
        }),
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.LOG_PRETTY === 'true' || process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers.x-api-key',
            'req.body.password',
            'req.body.token',
            'req.body.refreshToken',
            'res.headers["set-cookie"]',
          ],
          remove: true,
        },
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceInviteModule,
    BoardModule,
    ListModule,
    CardModule,
    CommentModule,
    WorkspaceMemberModule,
    HealthModule,
    RedisModule,
    CharacterModule,
    GamificationModule,
    PersonalModule,
    UserSettingsModule,
    SocialModule,
    PartyModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [ ],
})
export class AppModule {}
