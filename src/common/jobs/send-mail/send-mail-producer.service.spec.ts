import {
  SendMailProducerService,
  emailQueueToken,
} from './send-mail-producer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { SendMailJobDto } from '../dto/send-mail-job.dto';

describe('SendMailProducerService', () => {
  let sendMailProducerService: SendMailProducerService;
  let emailQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMailProducerService,
        {
          provide: getQueueToken(emailQueueToken),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    sendMailProducerService = module.get<SendMailProducerService>(
      SendMailProducerService,
    );
    emailQueue = module.get<Queue>(getQueueToken(emailQueueToken));
  });

  it('should be defined', () => {
    expect(sendMailProducerService).toBeDefined();
    expect(emailQueue).toBeDefined();
  });

  describe('sendConfirmationEmail', () => {
    it('should create a job to send a confirmation email', async () => {
      // Arrange
      const emailData: SendMailJobDto = {
        userEmail: 'everardo41@osinski.com',
        userLogin: 'Sandsan',
        otgCode: Math.random().toString().slice(-6),
        app_name: '',
      };

      // Act
      await sendMailProducerService.sendConfirmationEmail(emailData);

      // Assert
      expect(emailQueue.add).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the method add on emailQueue fails', () => {
      // Arrange
      const emailData: SendMailJobDto = {
        userEmail: 'eeffertz@yahoo.com',
        userLogin: 'VanInquisitive',
        otgCode: Math.random().toString().slice(-6),
        app_name: '',
      };
      jest.spyOn(emailQueue, 'add').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        sendMailProducerService.sendConfirmationEmail(emailData),
      ).rejects.toThrow();
    });
  });
});
