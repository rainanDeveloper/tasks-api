import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SendMailJobDto } from '../dto/send-mail-job.dto';

export const emailQueueToken = 'emailQueue';

export enum emailQueueJobs {
  SendConfirmationEmailJob = 'SendConfirmationEmailJob',
}

@Injectable()
export class SendMailProducerService {
  constructor(
    @InjectQueue(emailQueueToken) private readonly emailQueue: Queue,
  ) {}
  async sendConfirmationEmail(emailData: SendMailJobDto) {
    this.emailQueue.add(emailQueueJobs.SendConfirmationEmailJob, emailData);
  }
}
