import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
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
  //   private kakaoParams: IKakaoParams;
  constructor() {
    // console.log(process.env.KAKAO_PARARMS);
    // this.kakaoParams = new URLSearchParams(
    //   JSON.parse(process.env.KAKAO_PARARMS),
    // );
    this.kakaoBaseUri = 'https://kauth.kakao.com/oauth/token?';
  }

  async getOauthPage(platform: 'kakao' | 'google' | 'apple') {
    let params: URLSearchParams;
    switch (platform) {
      case 'kakao':
        params = this.kakaoParams;
        break;
    }

    let baseUrl = '';
  }
}

// {
//   client_id: process.env.KAKAO_CLIENT_ID,
//   redirect_uri: process.env.KAKAO_REDIRECT_URI,
//   scope: '',
//   response_type: 'code',
// };
