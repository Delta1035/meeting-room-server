import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '528491526@qq.com',
        pass: 'gnxwvetlljrwbjeg',
      },
    });
  }

  async sendMail(options: Mail.Options) {
    await this.transporter.sendMail({
      from: '528491526@qq.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
