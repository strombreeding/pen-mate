import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { Games } from 'src/types/games';

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
  initGame(@Body() body: Record<string, any>) {
    console.log(body);
    const result = this.gameService.createNewGame(body);
    return { result };
    // 서비스로직으로 게임 만들고 해당 게임 ID 리턴해주기
  }
}