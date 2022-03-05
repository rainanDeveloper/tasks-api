import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TemplateEmailMessage } from 'src/common/dto/IMailMessage';
import { MailService } from 'src/common/services/mail.service';
import { emailQueueJobs, emailQueueToken } from './send-mail-producer.service';
import { SendMailJobDto } from '../dto/send-mail-job.dto';

@Processor(emailQueueToken)
export class SendMailConsumerProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process(emailQueueJobs.SendConfirmationEmailJob)
  async sendMailJob(job: Job<SendMailJobDto>) {
    const emailData = job.data;

    const emailMessage: TemplateEmailMessage = {
      template: 'user-activation-email',
      to: emailData.userEmail,
      subject: 'Confirme seu usuário em nossa plataforma',
      context: {
        login: emailData.userLogin,
        otgCode: emailData.otgCode,
        app_name: emailData.app_name,
      },
    };

    try {
      this.mailService.sendTemplateEmail(emailMessage);
    } catch (error) {
      throw new Error(
        `Error while trying to send confirmation email: ${error}`,
      );
    }
  }
}
