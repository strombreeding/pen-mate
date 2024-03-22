import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './game.schema';
import { UserService } from 'src/user/user.service';
import { GameRecord } from './game_record.schema';
import { CostObjProps, RecordProps } from 'src/types/record';
@Injectable()
export class GameService {
  private gameDatas = [];
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    @InjectModel(GameRecord.name)
    private readonly gameRecordModel: Model<GameRecord>,
    private readonly userService: UserService,
  ) {}

  async createNewGame(recordData: RecordProps, token: string) {
    // 해당 유저 id와 게임타이틀, 들어간 비용과 얻을 리워드 가데이터 만들어서 리턴
    // 리턴값으로 프론트 쿠키에 저장후 갱신
    try {
      const tokenVerify = await this.userService.verifyToken(token);
      const costForUpdate = { update: {} };
      // 유저 정보 업데이트
      const user = await this.userService.getById(tokenVerify.id);
      if (!user) throw new HttpException('not found', 404);

      // 코스트 검증 및 업데이트 객체에 추가
      recordData.costObj.map((obj: CostObjProps, i) => {
        if (obj.type === 'energy' && user.energy < obj.cost) {
          throw new HttpException('not enough energy', 400);
        }

        if (obj.type === 'atata_un' && user.atata_stone < obj.cost) {
          throw new HttpException('not enough atataStone', 400);
        }

        if (obj.type === 'energy') {
          costForUpdate.update = {
            ...costForUpdate.update,
            energy: user.energy - obj.cost,
          };
        }

        if (obj.type === 'atata_un') {
          costForUpdate.update = {
            ...costForUpdate.update,
            atata_stone: user.atata_stone - obj.cost,
          };
        }
      });

      console.log(costForUpdate.update);
      await user.updateOne({ _id: user.id, $set: costForUpdate.update });

      const createNewGameRecord = await this.gameRecordModel.create({
        game_title: recordData.gameTitle,
        player_id: tokenVerify.id,
        cost_obj: recordData.costObj,
      });

      return {
        record: createNewGameRecord,
        updateSource: {
          ...costForUpdate.update,
        },
      };
    } catch (err) {
      if (err.message.includes('jwt expired')) {
        throw new HttpException('jwt expired', 401);
      }
      if (err.message.includes('invalid signature')) {
        throw new HttpException('invalid signature', 401);
      }
      if (err.message.includes('not enough')) {
        throw new HttpException(err.message, 400);
      }
      console.log(err);
      throw new Error(err);
    }
  }

  recordGameData() {
    return; // 생성된 Game 데이터
  }
}
