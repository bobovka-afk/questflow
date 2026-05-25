import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-google-oauth20';
declare const GoogleStrategy_base: new (...args: any) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): {
        email: any;
        name: any;
        picture: any;
    };
}
export {};
