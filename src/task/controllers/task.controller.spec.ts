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
          useValue: {
            create: jest.fn().mockResolvedValue(taskList[0]),
          },
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

  describe('create', () => {
    it('should create a new task successfully', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        description: 'Something to do 3 of user 1',
      };

      // Act
      const result = await taskController.create(createTaskDto, userList[0].id);

      // Assert
      expect(result).toEqual(taskList[0]);
      expect(taskService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method create on taskService fails', () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        description: 'Something to do 3 of user 1',
      };
      jest.spyOn(taskService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        taskController.create(createTaskDto, userList[0].id),
      ).rejects.toThrowError();
    });
  });
});
