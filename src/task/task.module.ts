import { Module } from '@nestjs/common';
import { Task } from './schemas/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TaskModule {}
