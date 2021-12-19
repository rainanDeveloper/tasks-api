import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User login is a required field' })
  login: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User email is a required field' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User password is a required field' })
  password: string;
}
