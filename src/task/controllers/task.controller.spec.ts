import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/schemas/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../schemas/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';

const userList: User[] = [
  new User({
    id: 1,
    login: 'BrainlessDare',
    email: 'bmetz@hotmail.com',
    password: 'PRnzvYLsE5bLv2Zicg8',
  }),
  new User({
    id: 2,
    login: 'Thunderingsama',
    email: 'armstrong.adolf@gmail.com',
    password: 'ab4AaTvQ9A9s3Kqvjdk',
  }),
];

const taskList: Task[] = [
  new Task({
    description: 'Something to do 1 of user 1',
    user: userList[0],
  }),
  new Task({
    description: 'Something to do 2 of user 1',
    user: userList[0],
  }),
  new Task({
    description: 'Something to do 1 of user 2',
    user: userList[1],
  }),
  new Task({
    description: 'Something to do 2 of user 2',
    user: userList[1],
  }),
];

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {},
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
    expect(taskService).toBeDefined();
  });
});
