import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../schemas/user.entity';
import { UserActivationService } from './user-activation.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserActivation } from '../schemas/user-activation.entity';
import { SendMailProducerService } from '../../common/jobs/send-mail/send-mail-producer.service';

const userList: User[] = [
  new User({
    id: 1,
    login: 'DasAxiomatic',
    email: 'fspinka@graham.biz',
    password: 'EX5UEGfiUg4NxXbKa',
    is_active: true,
  }),
  new User({
    id: 2,
    login: 'Guyapple',
    email: 'payton.lehner@halvorson.com',
    password: 'FSPsyzc7hU6ZbMMFjyC',
  }),
];

const userActivationList: UserActivation[] = [
  new UserActivation({
    email: 'ojones@gmail.com',
  }),
];

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let mailQueueService: SendMailProducerService;
  let userActivationService: UserActivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
            save: jest.fn().mockResolvedValue(userList[0]),
            findOne: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn().mockResolvedValue(userList[0]),
          },
        },
        {
          provide: SendMailProducerService,
          useValue: {
            sendConfirmationEmail: jest.fn(),
          },
        },
        {
          provide: UserActivationService,
          useValue: {
            create: jest.fn().mockResolvedValue(userActivationList[0]),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mailQueueService = module.get<SendMailProducerService>(
      SendMailProducerService,
    );
    userActivationService = module.get<UserActivationService>(
      UserActivationService,
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user sucessfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        login: 'AxileDeyse',
        email: 'dav000@masjoco.com',
        password: 'ht5gtjNzD9GJXRB',
      };
      // Act
      const result = await userService.create(createUserDto);

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the save method on userRepository fails', () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        login: 'AxileDeyse',
        email: 'dav000@masjoco.com',
        password: 'ht5gtjNzD9GJXRB',
      };
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.create(createUserDto)).rejects.toThrowError();
    });
  });

  describe('findOneByLogin', () => {
    it('should find a user successfully', async () => {
      // Act
      const result = await userService.findOneByLogin('Yikesovski');

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOne on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.findOneByLogin('Yikesan')).rejects.toThrowError();
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user successfully', async () => {
      // Act
      const result = await userService.findOneByEmail('marge81@hoppe.com');

      // Assert
      expect(result).toEqual(userList[0]);
    });
    it('should throw an error when method findOne on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        userService.findOneByEmail('hdaugherty@hotmail.com'),
      ).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a user sucessfully', async () => {
      // Assert
      const updateUserDto = {
        login: 's4d133xul74n7',
        email: 'ervin.rempel@yahoo.com',
        password: 'u3JxhW4F8ZvPqUKuf2',
      };

      // Act
      const result = await userService.update(1, updateUserDto);

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method update on userRepository fails', () => {
      // Arrange
      const updateUserDto = {
        login: 's4d133xul74n7',
        email: 'ervin.rempel@yahoo.com',
        password: 'u3JxhW4F8ZvPqUKuf2',
      };
      jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.update(1, updateUserDto)).rejects.toThrowError();
    });
  });

  describe('createUserActivation', () => {
    it('should start a user activation', async () => {
      // Act
      const result = await userService.createUserActivation(1);

      // Assert
      expect(result).toEqual(userActivationList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userActivationService.create).toHaveBeenCalledTimes(1);
      expect(mailQueueService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOne on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.createUserActivation(1)).rejects.toThrowError();
    });

    it('should throw an error when method create on userActivationService fails', () => {
      // Arrange
      jest
        .spyOn(userActivationService, 'create')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.createUserActivation(1)).rejects.toThrowError();
    });

    it('should throw an error when method sendConfirmationEmail on mailQueueService fails', () => {
      // Arrange
      jest
        .spyOn(mailQueueService, 'sendConfirmationEmail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.createUserActivation(1)).rejects.toThrowError();
    });
  });
});
