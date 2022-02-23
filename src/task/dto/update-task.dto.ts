import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  done: boolean;
}
