import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserActivationByOtgDto {
  @ApiProperty()
  @IsNotEmpty()
  otgCode: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
