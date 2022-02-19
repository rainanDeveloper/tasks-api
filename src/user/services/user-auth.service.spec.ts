import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from './user-auth.service';
import { UserService } from './user.service';
import * as crypto from 'crypto';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserActivationService } from './user-activation.service';
import { User } from '../schemas/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UserActivation } from '../schemas/user-activation.entity';

const userList: User[] = [
  new User({
    id: 1,
    login: 'Spiffystein',
    email: 'gerhold.ellie@hotmail.com',
    password: 'icXt7c5fr2BTeD',
    is_active: true,
  }),
  new User({
    id: 2,
    login: 'Katieoff',
    email: 'dschmitt@yahoo.com',
    password: 'pLdhcRnTBy82hw',
  }),
];

const userActivationList: UserActivation[] = [
  new UserActivation({
    email: 'dschmitt@yahoo.com',
    otgCode: '985954',
  }),
];

describe('UserAuthService', () => {
  let userAuthService: UserAuthService;
  let userService: UserService;
  let userActivationService: UserActivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const secret =
              configService.get<string>('JWT_SECRET') ||
              crypto.randomBytes(63).toString('base64');
            const expiresIn =
              configService.get<string>('JWT_EXPIRES_IN') || '1d';
            return {
              secret,
              signOptions: { expiresIn },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        UserAuthService,
        {
          provide: UserService,
          useValue: {
            update: jest.fn().mockResolvedValue(userList[0]),
            findOneByLogin: jest.fn().mockImplementation(async () => {
              return {
                ...userList[0],
                password: await bcrypt.hash(userList[0].password, 12),
              };
            }),
            activateUser: jest.fn(),
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

    userAuthService = module.get<UserAuthService>(UserAuthService);
    userService = module.get<UserService>(UserService);
    userActivationService = module.get<UserActivationService>(
      UserActivationService,
    );
  });

  it('should be defined', () => {
    expect(userAuthService).toBeDefined();
  });

  describe('login', () => {
    it('should log in user successfully', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[0].login,
        password: userList[0].password,
      };

      // Act
      const result = await userAuthService.login(loginDto);

      // Assert
      expect(result).toEqual({
        login: userList[0].login,
        email: userList[0].email,
        token: expect.any(String),
      });
      expect(userService.findOneByLogin).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method findOneByLogin on userService fails', () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[0].login,
        password: userList[0].password,
      };

      jest
        .spyOn(userService, 'findOneByLogin')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userAuthService.login(loginDto)).rejects.toThrowError();
    });

    it('should throw an BadRequestException when user finded is inactive', () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[1].login,
        password: userList[1].password,
      };

      jest.spyOn(userService, 'findOneByLogin').mockImplementation(async () => {
        return {
          ...userList[1],
          password: await bcrypt.hash(userList[1].password, 12),
        };
      });

      // Assert
      expect(userAuthService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should activate user and log in successfully when the right otg_code is sent', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[1].login,
        password: userList[1].password,
        otg_code: userActivationList[0].otgCode,
      };

      jest.spyOn(userService, 'findOneByLogin').mockImplementation(async () => {
        return {
          ...userList[1],
          password: await bcrypt.hash(userList[1].password, 12),
        };
      });

      // Act
      const result = await userAuthService.login(loginDto);

      // Assert
      expect(result).toEqual({
        email: userList[1].email,
        login: userList[1].login,
        token: expect.any(String),
      });
      expect(
        userActivationService.findOneByOtgCodeAndEmail,
      ).toHaveBeenCalledTimes(1);
      expect(userActivationService.delete).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });
  });
});
