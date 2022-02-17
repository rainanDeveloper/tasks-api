import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  login: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.login = user?.login;
    this.email = user?.email;
    this.password = user?.password;
    this.is_active = user?.is_active || false;
    this.created_at = user?.created_at || new Date();
    this.updated_at = user?.updated_at || new Date();
  }
}
