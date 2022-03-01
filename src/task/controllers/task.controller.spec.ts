import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/schemas/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../schemas/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { NotFoundException, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

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
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn().mockResolvedValue(taskList[0]),
            findAllForUser: jest.fn().mockResolvedValue(taskList),
            findOneByIdForUser: jest.fn().mockResolvedValue(taskList[0]),
            updateOne: jest.fn().mockResolvedValue(taskList[0]),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
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

    it('should throw a NotFoundException when method create on taskService fails', () => {
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

  describe('findAllForUser', () => {
    it('should list all the tasks for the registered user', async () => {
      // Act
      const result = await taskController.findAllForUser(userList[0].id);

      // Assert
      expect(result).toEqual(taskList);
      expect(cacheManager.get).toHaveBeenCalledTimes(1);
      expect(taskService.findAllForUser).toHaveBeenCalledTimes(1);
      expect(cacheManager.set).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when method findAllForUser on taskService fails', () => {
      // Arrange
      jest
        .spyOn(taskService, 'findAllForUser')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(
        taskController.findAllForUser(userList[0].id),
      ).rejects.toThrowError();
    });

    it('should return all results from redis cache instead of a the database', async () => {
      // Arrange
      jest.spyOn(cacheManager, 'get').mockResolvedValue(taskList);

      // Act
      const result = await taskController.findAllForUser(userList[0].id);

      // Assert
      expect(result).toEqual(taskList);
      expect(cacheManager.get).toHaveBeenCalledTimes(1);
      expect(taskService.findAllForUser).toHaveBeenCalledTimes(0);
      expect(cacheManager.set).toHaveBeenCalledTimes(0);
    });

    it('should throw an error when method get on cacheManager fails', () => {
      // Arrange
      jest.spyOn(cacheManager, 'get').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        taskController.findAllForUser(userList[0].id),
      ).rejects.toThrowError();
    });
  });

  describe('findOneByIdForUser', () => {
    it('should find a task for user by id', async () => {
      // Act
      const result = await taskController.findOneByIdForUser(
        taskList[0].id,
        userList[0].id,
      );

      // Assert
      expect(result).toEqual(taskList[0]);
      expect(taskService.findOneByIdForUser).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when method findOneByIdForUser on taskService', () => {
      // Arrange
      jest
        .spyOn(taskService, 'findOneByIdForUser')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        taskController.findOneByIdForUser(taskList[0].id, userList[0].id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should update a task successfully', async () => {
      // Arrange
      const updateTaskDto: UpdateTaskDto = {
        done: true,
      };

      // Act
      const result = await taskController.updateOne(
        taskList[0].id,
        userList[0].id,
        updateTaskDto,
      );

      // Assert
      expect(result).toEqual(taskList[0]);
      expect(taskService.updateOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when method updateOne on taskService fails', () => {
      // Arrange
      const updateTaskDto: UpdateTaskDto = {
        done: true,
      };
      jest
        .spyOn(taskService, 'updateOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        taskController.updateOne(taskList[0].id, userList[0].id, updateTaskDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete a task sucessfully', async () => {
      // Act
      await taskController.deleteOne(taskList[0].id, userList[0].id);

      // Assert
      expect(taskService.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when method deleteOne on taskService fails', () => {
      // Arrange
      jest
        .spyOn(taskService, 'deleteOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        taskController.deleteOne(taskList[0].id, userList[0].id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
