import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../schemas/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/user/schemas/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const created = await this.taskRepository.insert({
      description: createTaskDto.description,
      done: false,
      user,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return created;
  }

  async findAllForUser(userId: number) {
    return await this.taskRepository.find({ user: { id: userId } });
  }
}
