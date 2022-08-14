import { Controller, Get, Post, Delete, Param, Body, Inject, ValidationPipe, ParseUUIDPipe, UseInterceptors, UploadedFile, HttpException, HttpStatus, Req, UseGuards, Put } from '@nestjs/common';
import { MatchHistoryDTO, ChangeUsernameDTO, AddorRemoveFriendDTO, CodeDTO } from './create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity'
import 'multer';
import { extname } from 'path';
import LocalFilesInterceptor from './localFiles/localFiles.interceptor';
import { JwtAuthenticationGuard } from 'src/authentification/jwt-authentification.guard';
import RequestWithUser  from 'src/authentification/requestWithUser.interface'

@Controller('user')
export class UserController {

    @Inject(UserService)
    public readonly userService: UserService;


    //////////////////////// GET /////////////////////////
    @Get('/')
    @UseGuards(JwtAuthenticationGuard)
    findAllUser(): Promise<User[]> {
        return this.userService.findAllUser();
    }

    @Get('/friends')
    @UseGuards(JwtAuthenticationGuard)
    getFriends(@Req() request: RequestWithUser) {
        return this.userService.getFriends(request.user.id);
    }

    @Get('/getMatchHistory')
    @UseGuards(JwtAuthenticationGuard)
    async getMatchHistory(@Req() request: RequestWithUser) {
        
        return this.userService.getMatchHistory(request.user.id);
    }

    @Get('/gamesPlayed')
    @UseGuards(JwtAuthenticationGuard)
    async getGamesPlayed(@Req() request: RequestWithUser) {
        return this.userService.getGamesPlayed(request.user.id);
    }

    @Get('/getVictory')
    @UseGuards(JwtAuthenticationGuard)
    async getVictory(@Req() request: RequestWithUser) {
        return this.userService.getVictory(request.user.id);
    }

    @Get('/getLoose')
    @UseGuards(JwtAuthenticationGuard)
    async getLoose(@Req() request: RequestWithUser) {
        return this.userService.getLoose(request.user.id);
    }

    @Get('/getScore')
    @UseGuards(JwtAuthenticationGuard)
    async getScore(@Req() request: RequestWithUser) {
        return this.userService.getScore(request.user.id);
    }

    @Get('/ladderPosition')
    @UseGuards(JwtAuthenticationGuard)
    async getLadderPos(@Req() request: RequestWithUser) {
        return this.userService.getLadderPos(request.user.id);
    }

    @Get('/find/:username')
    @UseGuards(JwtAuthenticationGuard)
    async findUserByUname(@Param('username') uname: string): Promise<User> {
        return await this.userService.findUserByUname(uname);
    }

    @Get('login/:name')
    @UseGuards(JwtAuthenticationGuard)
    getUserByLogin(@Param('name', ValidationPipe) name: string): Promise<User> {
        
        return this.userService.findUserByLogin(name);
    }

    @Get('/avatarId/:id')
    @UseGuards(JwtAuthenticationGuard)
    getAvatarId(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.getAvatarId(id);
    }

    @Get('status/:username')
    @UseGuards(JwtAuthenticationGuard)
    getStatusUsername(@Param('username', ValidationPipe) name: string) {
        return this.userService.getStatusUsername(name);
    }


    //////////////////////// POST /////////////////////////
    @Post('/uploadAvatar/:id')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(LocalFilesInterceptor({
        fieldName: 'file',
        path: '/avatars',
        fileFilter: (req: any, file: any, cb: any) => {
            // // // // console.log('Interceptor: \n');
            // // // // console.log('mimetype = : ', file.mimetype);
            // // // // console.log('originalname: ', file.originalname);
            
            if (file.mimetype.includes('image'))
                cb(null, true);
            else
                cb( new HttpException(`Unsupported file type Ahahah ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        },
        limits: {
            fileSize: Math.pow(1024, 2) // 1MB
        }
    }))
    async uploadFile(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file) {
        
        if (id) // need to be chang with authentification
        {
            // // // // console.log("COUCOU upload");
            if (file)
            {
                // // // // console.log('On recoit un fichier ');
                // // // // console.log('nom = ', file.name);
                // // // // console.log(' type ', file.mimetype);
                // // // // console.log(' nom oridinal , ', file.originalname);
                // // // // console.log('id du type=', id);
                return this.userService.addAvatar(id, {
                    path: file.path,
                    filename: file.originalname,
                    mimetype: file.mimetype,
                });
            }
            else {
                // // // // console.log('pas de fichier');
            }
        }
    }

    @Post('/matchHistory')
    @UseGuards(JwtAuthenticationGuard)
    async updateHistory(@Req() request: RequestWithUser, @Body() body: MatchHistoryDTO) {
        
        // // // // console.log('dans match history: ,', body,);
        return this.userService.updateHistory(request.user.id, body);
    }

    @Post('/addfriend')
    @UseGuards(JwtAuthenticationGuard)
    addFriend(@Req() request: RequestWithUser, @Body() body: AddorRemoveFriendDTO) {

        return this.userService.addFriend(request.user.id, body.username);
    }

    @Post('/delfriend')
    @UseGuards(JwtAuthenticationGuard)
    delFriend(@Req() request: RequestWithUser, @Body() body: AddorRemoveFriendDTO) {

        // // // // console.log('delete friend');
        return this.userService.deleteFriend(request.user.id, body.username);
    }


    @Post('/changeUserName')
    @UseGuards(JwtAuthenticationGuard)
    changeUsername(@Body() body: ChangeUsernameDTO) {

        // // // // console.log('dans change username', body);
        return this.userService.changeUsername(body.id, body.username);
    }


    @Post('/postWatchCode')
    @UseGuards(JwtAuthenticationGuard)
    postWatchCode(@Req() request: RequestWithUser, @Body() code: CodeDTO) {
        return this.userService.putwatchGame(request.user.id, code);
    }

    //////////////////////// PUT /////////////////////////
    @Put('/offline')
    @UseGuards(JwtAuthenticationGuard)
    async putOfflin(@Req() request: RequestWithUser) {
        // // // // console.log('put offffline');
        return this.userService.putOffline(request.user.id);
    }



    @Put('/online')
    @UseGuards(JwtAuthenticationGuard)
    async putOnline(@Req() request: RequestWithUser) {
        return this.userService.putOnline(request.user.id);
    }

    @Put('/putIngame')
    @UseGuards(JwtAuthenticationGuard)
    async putIngame(@Req() request: RequestWithUser) {
        return this.userService.putIngame(request.user.id);
    }

    @Put('/putVictory')
    @UseGuards(JwtAuthenticationGuard)
    async putVictory(@Req() request: RequestWithUser) {
        return this.userService.putVictory(request.user.id);
    }

    @Put('/putLoose')
    @UseGuards(JwtAuthenticationGuard)
    async putLoose(@Req() request: RequestWithUser) {
        return this.userService.putLoose(request.user.id);
    }

    //////////////////////// DELETE /////////////////////////
    @Delete(':id')
    removeUser(@Param('id', ParseUUIDPipe) id: string) {
        // // // // console.log('User: ' + id + ' deleted!');
        return this.userService.removeUser(id);
    }


}

