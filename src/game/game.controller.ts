import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Games } from 'src/types/games';
import { RecordProps } from 'src/types/record';

@Controller('game')
export class GameController {
  private GameObject = Games;
  constructor(private gameService: GameService) {}

  @Get('/')
  getAllGame() {
    const result = Games.findAll();
    return { result: result };
  }

  @Get('/:id')
  getGameState(@Param() params: { id: string }) {
    const id = params.id;
    const result = Games.find(id);
    return result;
  }

  @Post('/new')
  async initGame(@Body() body: { recordProps: RecordProps; at: string }) {
    const result = await this.gameService.createNewGame(
      body.recordProps,
      body.at,
    );
    return result;
  }

  @Post('/checkCost')
  async checkCost(@Body() body: { recordProps: RecordProps; at: string }) {
    const result = await this.gameService.createNewGame(
      body.recordProps,
      body.at,
    );
    return result;
  }

  @Put('/record')
  async recordGame(@Body() body: UpdateRecordProps) {
    console.log(body);
    const result = await this.gameService.updateGameRecord(body);
    return result;
  }
}

export type UpdateRecordProps = {
  player_id: string;
  game_title: string;
  rewards: { itemName: string; cnt: number }[];
  play_time: number;
  cost_obj: { type: string; cost: number }[];
  game_result: string;
  game_special_option: '';
  play_at: Date;
  _id: string;
  __v: 0;
};
