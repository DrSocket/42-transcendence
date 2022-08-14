import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from 'src/global/global.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  login42: string;

  @IsString()
  @IsNotEmpty()
  avatar42: string;

}



export class RegisterAsGuestDTO {
  @IsString()
  @IsNotEmpty()
  login42: string;

  @IsString()
  @IsNotEmpty()
  avatar42: string;
}
