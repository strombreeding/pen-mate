import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
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
}
