import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserActivation } from '../schemas/user-activation.entity';
import { UserActivationService } from './user-activation.service';
import { CreateUserActivationDto } from '../dto/create-user-activation.dto';
import { UserService } from './user.service';
import { User } from 'src/user/schemas/user.entity';
import { Repository } from 'typeorm';

const userActivationList: UserActivation[] = [
  new UserActivation({
    email: 'disoh21317@porjoton.com',
  }),
  new UserActivation({
    email: 'pattie_roberts@yahoo.com',
  }),
];

const userList: User[] = [
  new User({
    email: 'disoh21317@porjoton.com',
  }),
  new User({
    email: 'pattie_roberts@yahoo.com',
  }),
];

describe('UserActivationService', () => {
  let userActivationService: UserActivationService;
  let userActivationRepository: Repository<UserActivation>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActivationService,
        {
          provide: getRepositoryToken(UserActivation),
          useValue: {
            create: jest.fn().mockReturnValue(userActivationList[0]),
            save: jest.fn().mockResolvedValue(userActivationList[0]),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(userList[0]),
          },
        },
      ],
    }).compile();

    userActivationService = module.get<UserActivationService>(
      UserActivationService,
    );
    userActivationRepository = module.get<Repository<UserActivation>>(
      getRepositoryToken(UserActivation),
    );
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userActivationService).toBeDefined();
    expect(userActivationRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new userActivation sucessfully', async () => {
      // Arrange
      const userActivation: CreateUserActivationDto = {
        email: 'janick_schuppe@hotmail.com',
      };

      // Act
      const result = await userActivationService.create(userActivation);

      // Assert
      expect(result).toEqual(userActivationList[0]);
      expect(userActivationRepository.create).toHaveBeenCalledTimes(1);
      expect(userActivationRepository.save).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when findOneByEmail method on userService fails', () => {
      // Arrange
      jest.spyOn(userService, 'findOneByEmail').mockRejectedValue(new Error());

      const userActivation: CreateUserActivationDto = {
        email: 'janick_schuppe@hotmail.com',
      };

      // Assert
      expect(
        userActivationService.create(userActivation),
      ).rejects.toThrowError();
    });

    it('should throw an exception when save method on userActivationRepository fails', () => {
      // Arrange
      jest
        .spyOn(userActivationRepository, 'save')
        .mockRejectedValueOnce(new Error());

      const userActivation: CreateUserActivationDto = {
        email: 'janick_schuppe@hotmail.com',
      };

      // Assert
      expect(
        userActivationService.create(userActivation),
      ).rejects.toThrowError();
    });
  });
});
