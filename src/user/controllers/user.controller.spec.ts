import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

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

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
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
});
