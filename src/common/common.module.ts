import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { SendMailProducerService } from './jobs/send-mail/send-mail-producer.service';
import { SendMailConsumerProcessor } from './jobs/send-mail/send-mail-consumer.processor';
import { BullModule } from '@nestjs/bull';
import { emailQueueToken } from './jobs/send-mail/send-mail-producer.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: emailQueueToken,
    }),
  ],
  providers: [MailService, SendMailProducerService, SendMailConsumerProcessor],
  exports: [MailService, SendMailProducerService, SendMailConsumerProcessor],
})
export class CommonModule {}
