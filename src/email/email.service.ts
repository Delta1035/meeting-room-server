import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { config } from 'src/constant/config';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get(config.NODEMAILER_HOST),
      port: this.configService.get(config.NODEMAILER_PORT),
      secure: false,
      auth: {
        user: this.configService.get(config.NODEMAILER_USER),
        pass: this.configService.get(config.NODEMAILER_PASS),
      },
    });
  }

  async sendMail(options: Mail.Options) {
    await this.transporter.sendMail({
      from: this.configService.get(config.NODEMAILER_USER),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
