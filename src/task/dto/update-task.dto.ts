import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  done: boolean;
}
