import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { BodyEmailMessage, TemplateEmailMessage } from '../dto/IMailMessage';

@Injectable()
export class MailService {
  transporter: any;

  constructor(private readonly config: ConfigService) {
    const smtpHost = config.get('SMTP_HOST');

    if (smtpHost) {
      this.transporter = nodemailer.createTransport({
        host: config.get('SMTP_HOST'),
        port: Number.parseInt(config.get('SMTP_PORT')),
        secure: config.get('SMTP_SECURE') == 'true',
        auth: {
          user: config.get('SMTP_USER'),
          pass: config.get('SMTP_PASSWORD'),
        },
        tls: { rejectUnauthorized: false },
      });
    }
  }

  async sendEmail(message: BodyEmailMessage) {
    if (!this.transporter) {
      return;
    }

    const mailMessage: Mail.Options = {
      from: this.config.get('SMTP_EMAIL'),
      to: message.to,
      subject: message.subject,
      html: message.body,
    };

    return await this.transporter.sendMail(mailMessage);
  }

  async sendTemplateEmail(message: TemplateEmailMessage) {
    if (!this.transporter) {
      return;
    }
    const templateFilename = path.join(
      './template-emails',
      `${message.template}.ejs`,
    );

    if (!fs.existsSync(templateFilename))
      throw new Error('Template de email não encontrado!');

    const templateContent = fs.readFileSync(templateFilename, {
      encoding: 'utf-8',
    });

    const bodyContent = await ejs.render(
      templateContent,
      {
        context: message.context,
        async: true,
      },
      { async: true },
    );

    return await this.sendEmail({ ...message, body: bodyContent });
  }
}
