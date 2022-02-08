import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserActivation } from '../schemas/user-activation.entity';
import { UserActivationService } from './user-activation.service';
import { CreateUserActivationDto } from '../dto/create-user-activation.dto';
import { Repository } from 'typeorm';
import { User } from '../schemas/user.entity';
import { FindUserActivationByOtgDto } from '../dto/find-user-activation-by-otg.dto';

const userActivationList: UserActivation[] = [
  new UserActivation({
    email: 'disoh21317@porjoton.com',
    otgCode: '648861',
  }),
  new UserActivation({
    email: 'pattie_roberts@yahoo.com',
  }),
];

describe('UserActivationService', () => {
  let userActivationService: UserActivationService;
  let userActivationRepository: Repository<UserActivation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActivationService,
        {
          provide: getRepositoryToken(UserActivation),
          useValue: {
            create: jest.fn().mockReturnValue(userActivationList[0]),
            save: jest.fn().mockResolvedValue(userActivationList[0]),
            findOne: jest.fn().mockResolvedValue(userActivationList[0]),
            delete: jest.fn().mockResolvedValue(undefined),
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
  });

  it('should be defined', () => {
    expect(userActivationService).toBeDefined();
    expect(userActivationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new userActivation sucessfully', async () => {
      // Arrange
      const userActivation: CreateUserActivationDto = {
        email: 'janick_schuppe@hotmail.com',
        user: new User({
          email: 'janick_schuppe@hotmail.com',
        }),
      };

      // Act
      const result = await userActivationService.create(userActivation);

      // Assert
      expect(result).toEqual(userActivationList[0]);
      expect(userActivationRepository.create).toHaveBeenCalledTimes(1);
      expect(userActivationRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when save method on userActivationRepository fails', () => {
      // Arrange
      jest
        .spyOn(userActivationRepository, 'save')
        .mockRejectedValueOnce(new Error());

      const userActivation: CreateUserActivationDto = {
        email: 'janick_schuppe@hotmail.com',
        user: new User({
          email: 'janick_schuppe@hotmail.com',
        }),
      };

      // Assert
      expect(
        userActivationService.create(userActivation),
      ).rejects.toThrowError();
    });
  });

  describe('findOneByOtgCode', () => {
    it('should find a userActivation by OTG code successfully', async () => {
      // Arrange
      const findUserActivationDto: FindUserActivationByOtgDto = {
        otgCode: '648861',
        email: 'disoh21317@porjoton.com',
      };

      // Act
      const result = await userActivationService.findOneByOtgCodeAndEmail(
        findUserActivationDto,
      );

      // Assert
      expect(result).toEqual(userActivationList[0]);
      expect(userActivationRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOne fails', () => {
      // Arrange
      const findUserActivationDto: FindUserActivationByOtgDto = {
        otgCode: '648861',
        email: 'disoh21317@porjoton.com',
      };

      jest
        .spyOn(userActivationRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(
        userActivationService.findOneByOtgCodeAndEmail(findUserActivationDto),
      ).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete the userActivation sucessfully', async () => {
      // Act
      const result = await userActivationService.delete(1);

      // Assert
      expect(result).toBeUndefined();
      expect(userActivationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userActivationRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOne fails', () => {
      // Arrange
      jest
        .spyOn(userActivationRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userActivationService.delete(1)).rejects.toThrowError();
    });

    it('should throw an error when method delete fails', () => {
      // Arrange
      jest
        .spyOn(userActivationRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userActivationService.delete(1)).rejects.toThrowError();
    });
  });
});
