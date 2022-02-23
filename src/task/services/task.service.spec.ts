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
            find: jest
              .fn()
              .mockResolvedValue(
                taskList.filter((task) => task.user.id == userList[0].id),
              ),
            findOne: jest.fn().mockResolvedValue(taskList[0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
    expect(taskRepository).toBeDefined();
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

      // Assert
      expect(
        taskService.create(createTaskDto, userList[0]),
      ).rejects.toThrowError();
    });
  });

  describe('findAllForUser', () => {
    it('should find all tasks for user with id 1', async () => {
      // Act
      const result = await taskService.findAllForUser(userList[0].id);

      // Assert
      expect(result).toEqual(
        taskList.filter((task) => task.user.id == userList[0].id),
      );
      expect(taskRepository.find).toHaveBeenCalledTimes(userList[0].id);
    });

    it('should throw an error when method find on taskRepository fails', () => {
      // Arrange
      jest.spyOn(taskRepository, 'find').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskService.findAllForUser(userList[0].id)).rejects.toThrowError();
    });
  });

  describe('findOneByIdForUser', () => {
    it('should find a task by id for a specified user', async () => {
      // Act
      const result = await taskService.findOneByIdForUser(
        taskList[0].id,
        userList[0].id,
      );

      // Assert
      expect(result).toEqual(taskList[0]);
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOne on taskRepository fails', () => {
      // Arrange
      jest.spyOn(taskRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        taskService.findOneByIdForUser(taskList[0].id, userList[0].id),
      ).rejects.toThrowError();
    });
  });

  describe('deleteOne', () => {
    it('should delete a user successfully', async () => {
      // Act
      await taskService.deleteOne(taskList[0].id, userList[0].id);

      // Assert
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
      expect(taskRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method delete fails on taskRepository', () => {
      // Arrange
      jest.spyOn(taskRepository, 'delete').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        taskService.deleteOne(taskList[0].id, userList[0].id),
      ).rejects.toThrowError();
    });
  });
});
