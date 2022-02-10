import { MailService } from './mail.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BodyEmailMessage, TemplateEmailMessage } from '../dto/IMailMessage';

const timeout = 30 * 1000;

describe('MailService', () => {
  let mailService: MailService;

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
    it(
      'should send a email',
      async () => {
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
      },
      timeout,
    );
  });

  describe('sendTemplateEmail', () => {
    it(
      'should send a template email',
      async () => {
        // Arrange
        const emailTemplateMessage: TemplateEmailMessage = {
          template: 'test-template-email',
          to: 'machokuhl@fb2bg.site',
          subject: 'Teste de envio de email',
          context: {
            variable: 'This is a test variable',
          },
        };

        // Act
        const result = await mailService.sendTemplateEmail(
          emailTemplateMessage,
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.messageId).toBeDefined();
      },
      timeout,
    );
  });
});
