import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';
import { UserActivationService } from '../services/user-activation.service';
import { FindUserActivationByOtgDto } from '../dto/find-user-activation-by-otg.dto';
import { UserActivation } from '../schemas/user-activation.entity';

const userList: User[] = [
  new User({
    id: 1,
    login: 'AdoptedSis',
    email: 'jakubowski.oswald@gmail.com',
    password: 'EX5UEGfiUg4NxXbKa',
  }),
  new User({
    id: 2,
    login: 'Alliebear',
    email: 'mbeahan@koss.net',
    password: 'FSPsyzc7hU6ZbMMFjyC',
  }),
];

const userActivationList: UserActivation[] = [
  new UserActivation({
    email: userList[0].email,
    otgCode: Math.random().toString().slice(-6),
  }),
];

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userActivationService: UserActivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
            findOneByEmail: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn(),
          },
        },
        {
          provide: UserActivationService,
          useValue: {
            findOneByOtgCodeAndEmail: jest
              .fn()
              .mockResolvedValue(userActivationList[0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userActivationService = module.get<UserActivationService>(
      UserActivationService,
    );
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(userActivationService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        login: 'CroakOfPotato',
        email: 'kamren24@russel.com',
        password: 'oa5yRJbgCenQMpM8327',
      };

      // Act
      const result = await userController.create(createUserDto);

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method create on userService fails', () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        login: 'MadakRiafa',
        email: 'gerhold.anna@hotmail.com',
        password: 'FRmRHAdUWMjdmXQGp2Q',
      };
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(userController.create(createUserDto)).rejects.toThrowError();
    });
  });

  describe('activateUser', () => {
    it('should ativate a user successfully', async () => {
      // Arrange
      const dto: FindUserActivationByOtgDto = {
        email: userActivationList[0].email,
        otgCode: userActivationList[0].otgCode,
      };

      // Act
      const result = await userController.activateUser(dto);

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'User activated!',
      });
      expect(
        userActivationService.findOneByOtgCodeAndEmail,
      ).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userActivationService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
