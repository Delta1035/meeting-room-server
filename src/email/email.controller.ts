import { Controller, Global } from '@nestjs/common';
import { EmailService } from './email.service';
@Global()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
