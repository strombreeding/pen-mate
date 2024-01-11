import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialPlatform } from 'src/types/types';
import { UserService } from 'src/user/user.service';

@Controller('social')
export class SocialController {
  constructor(
    private socialService: SocialService,
    private userService: UserService,
  ) {}

  @Get()
  async getOauthUri(@Query() platform: { type: SocialPlatform }) {
    console.log(platform.type);
    const serviceResult = await this.socialService.getOauthPage(platform.type);
    return serviceResult;
  }

  @Post('/oauth')
  async getKakaoToken(@Body() body: { code: string }) {
    console.log(body);
    const serviceResult = await this.socialService.kakaoOauth(body.code);
    return { data: serviceResult, status: 200 };
  }
}
