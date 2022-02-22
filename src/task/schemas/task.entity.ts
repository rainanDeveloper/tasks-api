import { User } from 'src/user/schemas/user.entity';
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  description: number;

  @Column({ default: false, nullable: false })
  done: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  constructor(task?: Partial<Task>) {
    this.id = task?.id;
    this.description = task?.description;
    this.done = task?.done;
    this.user = task?.user;
    this.created_at = task?.created_at || new Date();
    this.updated_at = task?.updated_at || new Date();
  }
}
