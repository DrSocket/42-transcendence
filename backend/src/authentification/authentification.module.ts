import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthentificationService, SessionSerializer } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TwoFactorAuthenticationController } from './twoFactorAuthentification.controller';
import { TwoFactorAuthentificationService } from './twoFactorAuthentification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/user/user.entity';
import { TypeORMSession } from 'src/global/session.entity';



@Module({
    imports: [UsersModule, PassportModule.register({ session: true }), ConfigModule,
        // TypeOrmModule.forFeature([User, TypeORMSession]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    // expiresIn: `${Number(configService.get('JWT_EXPIRATION_TIME'))}s`,
                    expiresIn: "1d",
                },
            }),
        }),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 1,
        }),
        // TypeOrmModule.forFeature([User])
    ],

    providers: [AuthentificationService, LocalStrategy, JwtStrategy, TwoFactorAuthentificationService, SessionSerializer],
    controllers: [AuthentificationController, TwoFactorAuthenticationController], 
    exports: [AuthentificationService]
})
export class AuthentificationModule {}
