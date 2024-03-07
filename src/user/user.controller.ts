import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private userList = [];
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    // return await this.userService.findAll();
  }

  @Get(':id')
  async nickCheck(@Param() param: { id: string }) {
    console.log('하이', param);
    const a = this.userList.find((val) => val.nickname === param.id);
    console.log(a);
    if (a == undefined) {
      return true;
    } else {
      return false;
    }
  }

  @Post('/create')
  async create(@Body() data: any) {
    this.userList.push(data);

    return true;
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
