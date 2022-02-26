import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../schemas/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const created = this.taskRepository.create({
      description: createTaskDto.description,
      done: false,
      user: { id: userId },
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.taskRepository.save(created);
  }

  async findAllForUser(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({ user: { id: userId } });
  }

  async findOneByIdForUser(taskId: number, userId: number): Promise<Task> {
    const finded = await this.taskRepository.findOne(taskId, {
      where: { user: { id: userId } },
    });

    if (!finded) throw new NotFoundException(`Task ${taskId} not found!`);

    return finded;
  }

  async updateOne(
    taskId: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const finded = await this.findOneByIdForUser(taskId, userId);

    if (!finded) throw new NotFoundException(`Task ${taskId} not found!`);

    if (updateTaskDto.description)
      finded.description = updateTaskDto.description;

    if (updateTaskDto.done) finded.done = updateTaskDto.done;

    finded.updated_at = new Date();

    return await this.taskRepository.save(finded);
  }

  async deleteOne(taskId: number, userId: number) {
    const finded = await this.findOneByIdForUser(taskId, userId);

    if (!finded) throw new NotFoundException(`Task ${taskId} not found!`);

    return await this.taskRepository.delete(taskId);
  }
}
