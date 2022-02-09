import { MailService } from './mail.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BodyEmailMessage } from '../dto/IMailMessage';

describe('MailService', () => {
  let mailService: MailService;

  beforeAll(async () => {
    jest.setTimeout(30 * 1000);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MailService],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send a email', async () => {
      // Arrange
      const emailMessage: BodyEmailMessage = {
        to: 'machokuhl@fb2bg.site',
        subject: 'Teste de envio de email',
        body: 'Olá! Este é um email de teste enviado por um teste unitário!',
      };
      // Act
      const result = await mailService.sendEmail(emailMessage);
      // Assert
      expect(result).toBeDefined();
      expect(result.messageId).toBeDefined();
    });
  });
});
