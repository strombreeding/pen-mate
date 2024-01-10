import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    // return await this.userService.findAll();
  }

  @Post('/create')
  async create(@Body() data: any) {
    console.log(data, '하이;');
    return 'gdgd';
    // return await this.userService.create(data);
  }

  @Get('/kakao/redirect')
  async kakaoRedirect(@Body() body: any, @Query() query: any) {
    console.log(body);
    console.log('#########################################');
    console.log(query);
    return `
    다음 값을 지니에게 보내주세요.<br/>
    ${query.code} <br/>
    ${navigator.userAgent}
    `;
  }
}
