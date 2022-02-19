import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../schemas/user.entity';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from '../services/user-auth.service';
import { UserLoginDto } from '../dto/user-login.dto';
import * as crypto from 'crypto';

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

describe('UserAuthController', () => {
  let userAuthController: UserAuthController;
  let userAuthService: UserAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [
        {
          provide: UserAuthService,
          useValue: {
            login: jest.fn().mockImplementation(async () => {
              return {
                login: userList[0].login,
                email: userList[0].email,
                token: crypto.randomBytes(10).toString('base64'),
              };
            }),
          },
        },
      ],
    }).compile();

    userAuthController = module.get<UserAuthController>(UserAuthController);
    userAuthService = module.get<UserAuthService>(UserAuthService);
  });

  it('should be defined', () => {
    expect(userAuthController).toBeDefined();
  });

  describe('login', () => {
    it('should log in user successfully', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[0].login,
        password: userList[0].password,
      };

      // Act
      const result = await userAuthController.login(loginDto);

      // Assert
      expect(result).toEqual({
        login: userList[0].login,
        email: userList[0].email,
        token: expect.any(String),
      });
      expect(userAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method login on userAuthService fails', () => {
      // Arrange
      const loginDto: UserLoginDto = {
        login: userList[0].login,
        password: userList[0].password,
      };

      jest.spyOn(userAuthService, 'login').mockRejectedValueOnce(new Error());

      // Assert
      expect(userAuthController.login(loginDto)).rejects.toThrowError();
    });
  });
});
