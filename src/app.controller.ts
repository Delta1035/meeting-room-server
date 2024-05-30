import { Controller, Get, Global } from '@nestjs/common';
import { AppService } from './app.service';
@Global()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
