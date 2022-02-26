import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty()
  description?: string;

  @ApiProperty()
  done?: boolean;
}
