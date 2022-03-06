import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Property "login" is required' })
  login: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Property "password" is required' })
  password: string;
}
