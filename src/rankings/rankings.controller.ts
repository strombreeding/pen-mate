import { Controller, Get, Post } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private rankingService: RankingsService) {}

  @Get('/')
  getRankingAll() {
    return; //
  }

  @Get('/myRanking')
  getMyRanking() {
    return; //
  }

  @Post('/')
  postRanking() {
    // gameData 받아서
  }
}
