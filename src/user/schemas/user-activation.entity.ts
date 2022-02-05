import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { User } from 'src/user/schemas/user.entity';

@Entity()
export class UserActivation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  constructor(userActivation?: Partial<UserActivation>) {
    this.id = userActivation?.id;
    this.email = userActivation?.email;
    this.user = userActivation?.user;
    this.created_at = userActivation?.created_at || new Date();
    this.updated_at = userActivation?.updated_at || new Date();
  }
}
