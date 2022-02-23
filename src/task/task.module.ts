import { Module } from '@nestjs/common';
import { Task } from './schemas/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService],
})
export class TaskModule {}
