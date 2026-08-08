import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendFile(to: string, subject: string, filename: string, content: Buffer) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text: `Segue em anexo o arquivo solicitado: ${filename}`,
      attachments: [{ filename, content }],
    });
    this.logger.log(`Email sent to ${to} with attachment ${filename}`);
  }
}
