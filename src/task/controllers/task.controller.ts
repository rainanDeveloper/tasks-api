import { Controller, UseGuards } from '@nestjs/common';
import { AuthUserJwtGuard } from '../../user/guards/auth-user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthUserJwtGuard)
export class TaskController {}
