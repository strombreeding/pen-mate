import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // private userList = [];
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    const allUser = await this.userService.getAll();
    return allUser;
    // return await this.userService.findAll();
  }

  @Get(':nickname')
  async nickCheck(@Param() param: { nickname: string }) {
    try {
      console.log('하이', param);
      const isDuplicate = await this.userService.isDuplicateId(param.nickname);
      if (!isDuplicate) {
        return true; // 만들수 있다.
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('/refresh-token')
  async updateRefreshToken(@Body() body: { rt: string }) {
    console.log('리프레쉬');
    try {
      const { at, rt } = await this.userService.refreshToken(body.rt);
      return { at, rt };
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  @Post('/verify')
  verify(@Body() body: { at: string }) {
    console.log('베리파이');
    try {
      const json = this.userService.verifyToken(body.at);
      console.log('베리파이 던', json);
      return json;
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, 401);
    }
  }

  @Post('/create')
  async create(@Body() data: { id: string; email: string; nickname: string }) {
    console.log(data);
    try {
      const result = await this.userService.create(
        data.nickname,
        data.id,
        data.email,
      );
      console.log(result, '리턴값');
      return result;
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
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
