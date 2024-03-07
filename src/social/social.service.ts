import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { SocialPlatform } from 'src/types/types';
import { UserService } from 'src/user/user.service';
import { URLSearchParams } from 'url';
dotenv.config();

interface IKakaoParams {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: 'code';
}
@Injectable()
export class SocialService {
  private kakaoParams: URLSearchParams;
  private kakaoBaseUri: string;
  private kakaoOauthUri: string;
  //   private kakaoParams: IKakaoParams;
  constructor(private userService: UserService) {
    this.kakaoParams = new URLSearchParams(
      JSON.parse(process.env.KAKAO_PARARMS),
    );
    this.kakaoBaseUri = 'https://kauth.kakao.com/oauth/token?';
    console.log(this.kakaoParams);
    this.kakaoOauthUri = 'https://kauth.kakao.com/oauth/authorize?';
  }

  async getOauthPage(platform: SocialPlatform) {
    let params: string;
    let oauthUri: string;
    switch (platform) {
      case 'kakao':
        params = this.kakaoParams.toString();
        oauthUri = this.kakaoOauthUri;
        break;
    }
    console.log(oauthUri + params);

    return { status: 200, data: oauthUri + params };
  }

  async kakaoOauth(code: string) {
    const config = {
      grant_type: 'authorization_code',
      client_id: this.kakaoParams.get('client_id'),
      redirect_uri: this.kakaoParams.get('redirect_uri'),
      code,
    };
    const reqUrl = this.kakaoBaseUri;
    // console.log(params);
    const params = new URLSearchParams(config).toString();

    const res = await axios.post(reqUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const token = 'bearer ' + res.data.access_token;
    const apiUrl = 'https://kapi.kakao.com/v2/user/me';
    const profile = await axios.get(apiUrl, {
      headers: { Authorization: token },
    });
    let id: string;
    let email: string;
    if (profile.data.kakao_account.has_email) {
      email = profile.data.kakao_account.email;
    }
    if (profile.data) {
      id = profile.data.id;
    }
    console.log(id, email); // 이걸로 유저 서비스에서 가입했는지 여부 파악후 가입 진행

    const validatedUser = await this.userService.getUser(id);
    if (!validatedUser) {
      return { result: '/join', id, email };
    } else {
      // const {access_token, refresh_token} = await this.userService.login(id)
    }
  }
}

// {
//   client_id: process.env.KAKAO_CLIENT_ID,
//   redirect_uri: process.env.KAKAO_REDIRECT_URI,
//   scope: '',
//   response_type: 'code',
// };
