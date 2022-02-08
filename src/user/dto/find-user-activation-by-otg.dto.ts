import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserActivationByOtgDto {
  @IsNotEmpty()
  otgCode: string;

  @IsEmail()
  email: string;
}
