import { UnauthorizedException, Get, ClassSerializerInterceptor, Controller, Post, UseInterceptors, Res,  UseGuards, Req, HttpCode, Body, ValidationPipe, } from '@nestjs/common';
import { TwoFactorAuthentificationService } from './twoFactorAuthentification.service';
import { Response } from 'express';
import { JwtAuthenticationGuard, JwtTwoFactorGuard } from './jwt-authentification.guard';
import RequestWithUser from './requestWithUser.interface';
import { TwoFaAuthDto, Genereate2FactorIDDTO } from './two-factor.dto';
import { UserService } from 'src/user/user.service';
import { AuthentificationService } from './authentification.service';
import TokenPayload from './tokenPayload.interface';
import { User } from 'src/global';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {

    constructor(
        private readonly twoFactorAuthenticationService: TwoFactorAuthentificationService,
        private readonly userService: UserService,
        private readonly authentificateService: AuthentificationService,
    ) {}

 
    @Post('generate')
    @UseGuards(JwtTwoFactorGuard)
    async register(@Res() response: Response, @Body() request: Genereate2FactorIDDTO) {

        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthentification(request.id);
        response.setHeader("content-type","image/png");
        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }
 
    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async turnTwoFactor(@Req() request: RequestWithUser, @Body(ValidationPipe) {code}: TwoFaAuthDto) {

        if (code.length < 3 || code.length > 6)
            throw new UnauthorizedException('Wrong authentication code');
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorCodeValid(code, request.user);
        // // // // console.log(isCodeValid)
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        return await this.userService.turnOnTwoFactor(request.user.id);
    }

    @Post('authenticate')
    @UseGuards(JwtAuthenticationGuard)
    async authenticate(@Req() request: RequestWithUser, @Body(ValidationPipe) body: any) {

        // const decode = async (payload: TokenPayload) => {
        //     // // // console.log("id after 2fa:", payload.userId)
        //     return await this.userService.getById(payload.userId);
        // }

        // const user: User = await decode(body.param);
        // // // // console.log("and token:", body.param)
        const isCodeValid =  this.twoFactorAuthenticationService.isTwoFactorCodeValid(body.code, request.user);
        // // // // console.log(request.user.username);
        // // // // console.log(isCodeValid)
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        // Get new cookies
        const accessTokenCookie = this.authentificateService.getCookieWithJwtToken(request.user.id, true);
        const refreshToken = this.authentificateService.getCookieWithJwtRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshToken.cookie]);
        return request.user;
    }
}