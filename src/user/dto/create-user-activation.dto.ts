import { User } from "../schemas/user.entity";

export class CreateUserActivationDto {
  user: User;

  email: string;
}
