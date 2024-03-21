import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './game.schema';
@Injectable()
export class GameService {
  private gameDatas = [];
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<Game>,
  ) {}

  createNewGame(gameData: Record<string, any>) {
    const id = uuidv4();
    const data = { id, ...gameData };
    this.gameDatas.push(data);
    return data; // 생성된 게임 정보
  }

  recordGameData() {
    return; // 생성된 Game 데이터
  }
}
