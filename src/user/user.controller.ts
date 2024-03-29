import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService, verifyToken } from './user.service';
import { CostObjProps, RecordProps } from 'src/types/record';
import mongoose from 'mongoose';

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
  @Get('/one/:id')
  async getOne(@Param() param: { id: string }) {
    console.log(param);
    const result = await this.userService.getById(param.id);
    console.log(result);
    return result;
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
      const result = await this.userService.refreshToken(body.rt);
      return result;
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  @Post('/verify')
  async verify(@Body() body: { at: string }) {
    console.log('베리파이');
    try {
      const json = await verifyToken(body.at);
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
      throw new HttpException(err.message, 500);
    }
    // return await this.userService.create(data);
  }

  @Post('/checkCost')
  async checkCost(@Body() body: { costObj: CostObjProps[]; at: string }) {
    const result = await this.userService.checkCost(body.costObj, body.at);
    return result;
  }

  @Post('/admin')
  async adminLogin() {
    const result = await this.userService.login({
      social_id: '1234',
      email: 'admin',
    });
    return result;
  }

  @Put('/bounti/:id')
  async changeBounti(
    @Param() param: { id: string },
    @Body() body: { bounti: boolean },
  ) {
    const _id = new mongoose.Types.ObjectId(param.id);
    const xx = await this.userService.findOneAndUpdate(_id, body);
    return true;
  }
  // @Get('/kakao/redirect')
  // async kakaoRedirect(@Body() body: any, @Query() query: any) {
  //   console.log(body);
  //   console.log('#########################################');
  //   console.log(query);
  //   return `
  //   다음 값을 지니에게 보내주세요.<br/>
  //   ${query.code} <br/>
  //   ${navigator.userAgent}
  //   `;
  // }
}
