import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class JwtAuthenticationGuard extends AuthGuard('jwt-access') {
	// return true;
}

 // auth guard fort refresh token
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}


// auth generate qr code
@Injectable()
export class JwtTwoFactorGuard extends AuthGuard('jwt-two-factor') {}