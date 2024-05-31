import { Controller, Get, Global, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { REQUIRE_LOGIN, REQUIRE_PERMISSION } from './constant/provide';
@Global()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SetMetadata(REQUIRE_LOGIN, true)
  @SetMetadata(REQUIRE_PERMISSION, ['ddd'])
  @Get('aaa')
  aaaa() {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
