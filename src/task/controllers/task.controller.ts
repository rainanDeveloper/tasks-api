import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUserJwtGuard } from '../../user/guards/auth-user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UserIdRequest } from '../../user/decorators/user-id-request.decorator';
import { Task } from '../schemas/task.entity';
import { TaskService } from '../services/task.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('task')
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthUserJwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UserIdRequest() userId: number,
  ): Promise<Task> {
    return this.taskService.create(createTaskDto, userId);
  }

  @Get()
  async findAllForUser(@UserIdRequest() userId: number): Promise<Task[]> {
    return await this.taskService.findAllForUser(userId);
  }

  @Get(':id')
  async findOneByIdForUser(
    @Param('id') id: number,
    @UserIdRequest() userId: number,
  ): Promise<Task> {
    return await this.taskService.findOneByIdForUser(id, userId);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: number,
    @UserIdRequest() userId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateOne(id, userId, updateTaskDto);
  }
}
