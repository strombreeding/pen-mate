import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './game.schema';
import { UserService, verifyToken } from 'src/user/user.service';
import { GameRecord } from './game_record.schema';
import { CostObjProps, RecordProps } from 'src/types/record';
import { UpdateRecordProps } from './game.controller';
import { InventoryService } from 'src/inventory/inventory.service';
@Injectable()
export class GameService {
  private gameDatas = [];
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    @InjectModel(GameRecord.name)
    private readonly gameRecordModel: Model<GameRecord>,
    private readonly userService: UserService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createNewGame(recordData: RecordProps, token: string) {
    // 해당 유저 id와 게임타이틀, 들어간 비용과 얻을 리워드 가데이터 만들어서 리턴
    // 리턴값으로 프론트 쿠키에 저장후 갱신
    try {
      const tokenVerify = await verifyToken(token);
      const costForUpdate = [];
      const costResult = {};
      const owner_id = new mongoose.Types.ObjectId(tokenVerify.id);
      const inventory = await this.inventoryService.find({
        owner_id,
      });
      inventory.map((inventoryItem) => {
        recordData.costObj.map((costItem) => {
          if (costItem.type === inventoryItem.item.item_name) {
            if (inventoryItem.cnt < costItem.cost)
              throw new HttpException('not enough cost', 400);
            costForUpdate.push({
              item_name: costItem.type,
              cnt: inventoryItem.cnt - costItem.cost,
            });
            costResult[costItem.type] = inventoryItem.cnt - costItem.cost;
          }
        });
      });
      await this.inventoryService.addNewItem(owner_id, costForUpdate);
      const createNewGameRecord = await this.gameRecordModel.create({
        game_title: recordData.gameTitle,
        player_id: tokenVerify.id,
        cost_obj: recordData.costObj,
      });

      return {
        record: createNewGameRecord,
        updateSource: costResult,
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

  async updateGameRecord(data: UpdateRecordProps) {
    // data.rewards.push({ item_name: 'energy', cnt: 100 });
    try {
      const { rewards } = data;

      const record = await this.gameRecordModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(data._id),
        {
          $set: {
            ...data,
          },
        },
      );
      // const user = await this.userService.getById(data.player_id);
      const inventory = await this.inventoryService.find({
        owner_id: new mongoose.Types.ObjectId(data.player_id),
      });
      const updateSource: { item_name: string; cnt: number }[] = [];
      const result = {};
      inventory.map((inventoryItem) => {
        rewards.map((updateItem) => {
          if (updateItem.item_name === inventoryItem.item.item_name) {
            console.log(
              `
                ${updateItem.item_name} 
                기존 : ${inventoryItem.cnt}  
                추가 : ${updateItem.cnt}  
                결과 : ${updateItem.cnt + inventoryItem.cnt}  
              `,
            );
            updateSource.push({
              cnt: inventoryItem.cnt + updateItem.cnt,
              item_name: updateItem.item_name,
            });
            result[updateItem.item_name] = inventoryItem.cnt + updateItem.cnt;
          }
        });
      });
      const update = await this.inventoryService.addNewItem(
        new mongoose.Types.ObjectId(data.player_id),
        updateSource,
      );

      console.log(result, '리절트');
      return result;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }
}
