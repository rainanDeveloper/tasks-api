import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getStatus: jest.fn().mockReturnValue({
              status: 'Ok',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
  });

  describe('root', () => {
    it('should return status "Ok"', () => {
      expect(appController.getStatus()).toEqual({
        status: 'Ok',
      });
      expect(appService.getStatus).toHaveBeenCalledTimes(1);
    });
  });
});
