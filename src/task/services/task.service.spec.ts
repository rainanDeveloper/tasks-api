import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '../schemas/task.entity';
import { TaskService } from './task.service';
import { User } from '../../user/schemas/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const userList: User[] = [
  new User({
    id: 1,
    login: 'TheWarySordid',
    email: 'bmetz@hotmail.com',
    password: 'PRnzvYLsE5bLv2Zicg8',
  }),
  new User({
    id: 2,
    login: 'SploshOfDallas',
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

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            insert: jest.fn().mockResolvedValue(taskList[0]),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        description: 'New task',
      };

      // Act
      const result = await taskService.create(createTaskDto, userList[0]);

      // Assert
      expect(result).toEqual(taskList[0]);
      expect(taskRepository.insert).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method insert on taskRepository fails', () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        description: 'New task',
      };
      jest.spyOn(taskRepository, 'insert').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        taskService.create(createTaskDto, userList[0]),
      ).rejects.toThrowError();
    });
  });
});
