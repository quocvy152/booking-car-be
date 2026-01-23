import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  ApiStandardController,
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from './common/swagger';

@ApiStandardController('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiStandardResponse(200, 'Successfully retrieved hello message')
  @ApiStandardErrorResponse()
  getHello(): string {
    return this.appService.getHello();
  }
}
