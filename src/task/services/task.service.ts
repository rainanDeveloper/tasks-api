import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../schemas/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/user/schemas/user.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const created = this.taskRepository.create({
      description: createTaskDto.description,
      done: false,
      user,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.taskRepository.save(created);
  }

  async findAllForUser(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({ user: { id: userId } });
  }

  async findOneByIdForUser(taskId: number, userId: number): Promise<Task> {
    return await this.taskRepository.findOne(taskId, {
      where: { user: { id: userId } },
    });
  }

  async updateOne(
    taskId: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const finded = await this.findOneByIdForUser(taskId, userId);

    if (!finded) throw new NotFoundException(`Task ${taskId} not found!`);

    finded.done = updateTaskDto.done;

    return await this.taskRepository.save(finded);
  }

  async deleteOne(taskId: number, userId: number) {
    const finded = await this.findOneByIdForUser(taskId, userId);

    if (!finded) throw new NotFoundException(`Task ${taskId} not found!`);

    return await this.taskRepository.delete(taskId);
  }
}
