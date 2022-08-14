
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MatchHistoryDTO, CodeDTO } from './create-user.dto';
import LocalFilesService from './localFiles/localFiles.service';
import * as bcrypt from 'bcrypt';

import { Status } from 'src/global/global.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private localFilesService: LocalFilesService,
    
  ) {}


    /*
    NEED TO DELETE USELESS FUNCTIONS 
    */

    async putwatchGame(id: string, code: CodeDTO) {
      const user = await this.userRepository.findOne({ where: {id: id}});
      // // // // console.log('la');
      if (user) {
        await this.userRepository.update(id, {watchGame: code.code})
        return {
          sucess: true,
          message: 'Watchcode updated'
        };
      }
      return {
        sucess: false,
        message: 'Watchcode not updated'
      };
    }

    async getAvatarId(id: string): Promise<string> {
      const user = await this.userRepository.findOne({ where: {id: id}});
      if (user) { 
        // // // // console.log('bingo');
        return user.avatarId;
      }
      else
        throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND);
    }

    // Chasnge avatar42 quand user upload une image
    async changeAvatar42(userid: string) {
      const user = await this.userRepository.findOne({ where: {id: userid}});
      if (user) {
        try {
  
          await this.userRepository.update(userid, {avatar42: 'upload'})
          return {
            sucess: true,
            message: 'Avatar42 change'
          };
        } catch (err) {
          // // // // console.log(err);
        }
      }
    }

    // supprime le refresh token de la base
    async removeRefreshToken(userId: string) {
      return this.userRepository.update(userId, {
        refreshToken: null
      });
    }
      // sauve le current refresh token en hashed
      async setCurrentRefreshToken(token: string, userId: string) {
        const refreshToken = await bcrypt.hash(token, 10);
        await this.userRepository.update(userId, { refreshToken });
    }

      // verifie si le refresh token est bien celui de la database
    async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
      
      const user = await this.getById(userId);
      const isRefreshTokenMatching = await bcrypt.compare( refreshToken, user.refreshToken );
      if (isRefreshTokenMatching) {
        return user;
      }
    }    


  // test google auth
  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update( userId, {twoFactorAuthenticationSecret: secret});
  }

  async turnOnTwoFactor(userId: string) {
    // // // // console.log('Dans la fonction User service, turnOn2Factor');
    const user = await this.getById(userId);
    if (user) {
      if (user.isTwoFactorAuthentificationEnabled == true) {
        return this.userRepository.update(userId, {isTwoFactorAuthentificationEnabled: false});
      }
      else {
        return this.userRepository.update(userId, {isTwoFactorAuthentificationEnabled: true});
      }
    }
    throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND);
    
  }


  // find or not find user, it returns
  async getLogin42(login42: string) {
    const user = await this.userRepository.findOne({ where: {login42}})
    return user;
  }



  async findUserByLogin(login42: string) {
    const user = await this.userRepository.findOne({ where: {login42}})
    if (user)
      return user;
    throw new HttpException('Cannot get the firstname with this id.', HttpStatus.NOT_FOUND);
  }
  

  async putgay(id: string) {
    // // // // console.log('meurt');
  }

  ///////////////////////////////////////////


    // test authentification
  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: {id}});
    if (user) {
      return user;
    }
    throw new HttpException('User doesnt exist with this id', HttpStatus.NOT_FOUND);
  }




  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (!user)
      throw new HttpException('User not found, try again ;-)', HttpStatus.NOT_FOUND);
    else
      return user;
  }

  async findUserByUname(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username }});
    if (!user)
      throw new HttpException('User not found, try again ;-)', HttpStatus.NOT_FOUND);
    else
      return user;
  }


  async findUserLogin42(login42: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login42 }});
    if (!user)
      throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
    return user;
  }


   /*
  **  Methods used with @Post() / Put()
  **    All these methods change data 
  */

  async create42(body: Partial<User>) {
    const newUser = await this.userRepository.create(body);
    await this.userRepository.save(newUser);
    return newUser;
  }

  // Save the file into the database and connect the id of the file to the id of avatar user's
  async addAvatar(userId: string, fileData: LocalFilesDto) {

    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
  }

   /*
  **  Method used with @Delete()
  **    
  */
  // This function delete the user from the database
  async removeUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (user)
      await this.userRepository.delete(id);
    else
      throw new HttpException('User not found, try again ;-)', HttpStatus.NOT_FOUND);
  }

  async getStatusUsername(username: string) {
    const user = await this.userRepository.findOne({ where: {username: username}});
    if (user) {
      // // // // console.log('user status ? = ', user.status);
      return user.status;
    }
    else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }


  ////////////////////////////////////////////GAME//////////////////////////////////



  async getUsernameScore() {
    const TT_objec = await this.userRepository.find({ select: {
      username: true,
      score: true,
      wins: true,
      losses: true,
      }, order: {
        score: "DESC",
        wins: "DESC",
        losses: "ASC",
      }
    });
    return TT_objec;
  }

  async getLadderPos(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      let total = user.wins - user.losses;
      const all_data = await this.getUsernameScore();
      for ( const item in all_data) {
        if (all_data[item].username == user.username) {
          return item;
        }
      }

    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }


  async getGamesPlayed(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      let total = user.wins + user.losses;
      return total;
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async getUserStatus(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      // // // // console.log('Dans get status : ', user.status, " id = ", user.id);
      return user.status
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async getVictory(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      return user.wins;
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async getLoose(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      return user.losses;
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async putVictory(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      // // // // console.log('dans Victory')
      let value = user.wins;
      // // // // console.log('avat value - ', value);
      value += 1;
      // // // // console.log('apres value  - ', value);
      await this.userRepository.update(id, {wins: value});


      const ret = await this.putScore(id);
      if (ret.sucess == true) {
        return {
          sucess: true,
          message: 'Victory updated.'
        };
      } else {
        return {
          sucess: false,
          message: 'Victory NOT updated.'
        };
      }

    }
    else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async putLoose(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      let value = user.losses;
      // // // // console.log('numver - ', value);
      value += 1;
      // // // // console.log('numver2  - ', value);
      await this.userRepository.update(id, {losses: value});


      const ret = await this.putScore(id);
      if (ret.sucess == true) {
        return {
          sucess: true,
          message: 'Loose updated.'
        };
      } else {
        return {
          sucess: false,
          message: 'Loose NOT updated.'
        };
      }
    }
    else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async putScore(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      // let value_loose = user.losses;
      // let value_wins = user.wins;
      let total_value = user.wins - user.losses;

      // // // // console.log('total_value - ', total_value);
      // value_loose -= 1;
      // // // // // console.log('numver2  - ', value_loose);
      await this.userRepository.update(id, {score: total_value});
      return {
        sucess: true,
        message: 'Score updated.'
      };
    }
    else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async getScore(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      return user.score;
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  

  async putOnline(id: string) {
    const user = await this.userRepository.findOne({ where: {id}});
    if (user) {
      try {
        // // // // console.log('Merde en ligne')
        await this.userRepository.update(id, {status: Status.ONLINE})
        return {
          sucess: true,
          message: 'Status updated online'
        };
      } catch (err) {
        // // // // console.log(err);
      }
    }
  }
  
  async putIngame(id: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user ) {

        await this.userRepository.update(id, {status: Status.INGAME})
        // // // // console.log('PUT INGAME user = ', user.id, " status = ", user.status)
          return {
            sucess: true,
            message: 'Status updated ingame'
          };
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async putIngame2(id: string, id2: string) {
    const user = await this.userRepository.findOne({ where: {id: id}});
    const user2 = await this.userRepository.findOne({ where: {id: id2}});
    if (user && user2) {
      try {
        await this.userRepository.update(id2, {status: Status.INGAME})
        await this.userRepository.update(id, {status: Status.INGAME})
        while (user.status != Status.INGAME && user2.status != Status.INGAME) {
          await this.userRepository.update(id, {status: Status.INGAME})
          await this.userRepository.update(id2, {status: Status.INGAME})
        }
        if (user.status == Status.INGAME && user2.status == Status.INGAME) {
          return {
            sucess: true,
            message: 'Status updated ingame'
          };
        }
      } catch (err) {
        // // // // console.log(err);
      }
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async isInGame(username: string) {

    const user = await this.userRepository.findOne({ where: {username: username}});
    if (user && user.status == Status.INGAME) {
      return true;
    }
    return false;      // check if user is in game
  }

  async socketOffline(login42: string) {
    // // // // console.log('dans BINGOOOOOOOOOOOOO');
    const user = await this.userRepository.findOne({ where: {login42: login42}});
    if (user) {
      try {

        await this.userRepository.update(user.id, {status: Status.OFFLINE})
        // // // // console.log('good ? ');
        return {
          sucess: true,
          message: 'Status updated offlibe'
        };
      } catch (err) {
        // // // // console.log(err);
      }
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }

  async putOffline(id: string) {
    // // // // console.log('dans putoffline');
    const user = await this.userRepository.findOne({ where: {id: id}});
    if (user) {
      try {

        await this.userRepository.update(id, {status: Status.OFFLINE})
        // // // // console.log('good ? ');
        return {
          sucess: true,
          message: 'Status updated offlibe'
        };
      } catch (err) {
        // // // // console.log(err);
      }
    } else {
      return {
        sucess: false,
        message: "This user doesn't exist."
      };
    }
  }



  async changeUsername(id: string, name: string) {
    // Try to find a user with this username
    const user_already_exist = await this.userRepository.findOne({ where: {username: name}})
    // // // // console.log('use existe ? ', user_already_exist);
    if (!user_already_exist) {
      const user = await this.userRepository.findOne({ where: {id}})
      if (!user)
        throw new HttpException('Changement de username', HttpStatus.NOT_FOUND);
      else {
        try {
          await this.userRepository.update(id, {username: name});
          // // // // console.log('good');
          return {
            sucess: true,
            message: 'Username updated'
          };
        } catch (err) {
          // // // // console.log(err);
        }
      }
    }
    return {
      sucess: false,
      message: 'Username NOT updated'
    };
  }

  isGameInHistory(id_game: string, user: User): boolean {

    for (const item in user.matchHistory) {
      let relou = item.split(' ')[0] 
      if (relou == id_game)
        return true;
    }
    return false

  }

  async updateHistory(id: string, body: MatchHistoryDTO) {

    if (body.id_p1 === '' || body.id_p2 === '') {
      return {
            sucess: false,
            message: "This user doesn't exist."
          };
    }
    // // Check if user exist
    const user_p1 = await this.userRepository.findOne({where: {id: body.id_p1}});
    const user_p2 = await this.userRepository.findOne({where: {id: body.id_p2}});

    // // // // console.log('DANS ARTE')

    if (!user_p1 || !user_p2) {
      return {
            sucess: false,
            message: "This user doesn't exist."
          };
    }

    // // // // console.log(body)

    let isingame_p1 = this.isGameInHistory(String(body.id_game), user_p1);
    let isingame_p2 = this.isGameInHistory(String(body.id_game), user_p2);


      let result = ''

    if (body.winner == body.id_p1) {
      result = body.id_game + " " + user_p1.username + " " + body.score_p1 + " VS " + body.score_p2 + " " + user_p2.username
    }
    else {
      result = body.id_game + " " + user_p2.username + " " + body.score_p2 + " VS " + body.score_p1 + " " + user_p1.username
    }

    if (isingame_p1 == false) {
      user_p1.addMatch(result);
      await this.userRepository.save(user_p1);
      if (body.winner == body.id_p1) {
        this.putVictory(body.id_p1);
      } else {
        this.putLoose(body.id_p1);
      }
    }
    if (isingame_p2 == false) {
      user_p2.addMatch(result);
      await this.userRepository.save(user_p2);
      if (body.winner == body.id_p2) {
        this.putVictory(body.id_p2);
      } else {
        this.putLoose(body.id_p2);
      }
    }

      

  }






  async getMatchHistory(id :string) {
    const user = await this.userRepository.findOne({ where: {id}});
    if (user) {
      if (user.matchHistory.length == 0)
        return [];
      else {
        return user.matchHistory;
      }
        
    }
    else {
      return {
        sucess: false,
        message: "This user does not exist."
      };
    }
  }


  async getStatusFriend(username: string) {
    const friend = await this.userRepository.findOne({ where: {username: username}})
    if (friend) {
      return friend.status;
    }
    else {
      return {
        sucess: false,
        message: "This user does not exist."
      };
    }
  }

    // test add friend
    async addFriend(id: string, username: string) {
      // // // // // console.log("Dans addFriend: ", userId, userName);
      // try to find user
      // // // // console.log('me = ', id, " autre = ", username);
      const friend = await this.userRepository.findOne({ where: {username: username}})
      // // // // console.log(friend)
      if (friend) {
        const user = await this.userRepository.findOne({ where: {id}})
        if (user.id == friend.id) {
          return {
            sucess: false,
            message: "Cannot add yourself."
          };
        }
        if (user.isFriend(friend.id) === -1) {
          
          const test = {username: friend.id, status: friend.status};
          // // // // console.log('test = ', test);
          user.addFriend(friend.id);
          
          await this.userRepository.save(user);
          // // // // console.log('la')
          return {
            sucess: true,
            message: "This friend is saved."
          };
        }
        else {
          return {
            sucess: false,
            message: "Already friend."
          };
        }
      }
      else {
        return {
          sucess: false,
          message: "This user doesn't exist."
        };
      }
    }

    async deleteFriend(id: string, username: string ) {

      const friend = await this.userRepository.findOne({ where: {username: username}})
      if (friend) {
        const user = await this.userRepository.findOne({ where: {id}})
        if (user.id == friend.id) {
          return {
            sucess: false,
            message: "Cannot delete yourself."
          };
        }
        if (user.isFriend(friend.id) != -1) {
          user.deleteFriend(friend.username);
          await this.userRepository.save(user);
          return {
            sucess: true,
            message: "This friend is not your friend longer."
          };
        }
        else {
          return {
            sucess: false,
            message: "You are not friend."
          };
        }
      }
      else {
        return {
          sucess: false,
          message: "This user doesn't exist."
        };
      }
    }

    findAllUser(): Promise<User[]> {
      return this.userRepository.find();
    }


    async getFriends(id: string) {

      const user = await this.userRepository.findOne({ where: {id}})
      if (!user) {
        return {
          sucess: false,
          message: "This user does not exist."
        };
      }
      else {
        if (user.friends_list.length == 0) {
          // // // // console.log("sans ami");
         return [];
        }
        else
        {
          // // // // console.log("with ami");
          const newFs = []
          for (const item of user.friends_list) {
            const user = await this.userRepository.findOne({ where: {id: item}})
            if (user)
              newFs.push(user.username)
          }
          return newFs
        }
      }
    }




}