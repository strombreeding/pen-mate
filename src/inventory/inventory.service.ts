import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { Item } from 'src/item/item.schema';
import { Inventory } from './inventory.schema';
import { ItemService } from 'src/item/item.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
    private readonly itemService: ItemService,
  ) {}

  async find(condition: FilterQuery<Inventory>) {
    try {
      const result = await this.inventoryModel.find(condition);
      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async getAllIventoryForRanking(owner_id: string) {
    try {
      const items = await this.inventoryModel
        .find({ 'item.item_name': 'atata_point' })
        // .find({ 'item.item_name': 'atata_point', cnt: { $gte: 10 } }) 추후 사람이 많아지면 이걸 로 조건을 바꾸셈
        .sort({ cnt: -1 })
        .populate('owner_id');

      const allUserRankings = [...items];
      let myRank = {};
      // 순위를 위한 rank 필드 추가
      const result = allUserRankings.map((item, index) => {
        const obj: RankingProps = {} as RankingProps;

        obj.rank = index + 1;
        obj._id = item.owner_id._id.toString();
        obj.atata_point = item.cnt;
        obj.nickname = item.owner_id.nickname;
        if (item.owner_id._id.toString() === owner_id) {
          myRank = { ...obj };
        }
        return obj;
      });
      console.log(result, '#########');

      return { allUserRankings: result, myRank };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }

  async addNewItem(
    owner_id: Types.ObjectId,
    itemList: { item_name: string; cnt: number }[],
  ) {
    console.log('inventory addNewItem', owner_id, itemList);
    try {
      const getItemList = await Promise.all(
        itemList.map((item) => this.itemService.findByName(item.item_name)),
      );

      // 아이템들 리스트를 찾았으니 이 리스트를 itemList를 반복하며 넣어주면 됨
      const addProcess = getItemList.map((item, index) => {
        console.log(itemList[index].item_name, itemList[index].cnt);
        return this.inventoryModel.findOneAndUpdate(
          {
            owner_id,
            'item.item_name': item.item_name,
          },
          {
            $set: {
              owner_id,
              cnt: itemList[index].cnt,
              item,
            },
          },
          { new: true, upsert: true },
        );
      });

      const results: Inventory[] = await Promise.all(addProcess);
      console.log(results, '인벤토리 아이템 추가내역');
      return results;
    } catch (err) {
      console.log(err, 'inventory_addNewItem');
      throw new HttpException(err.message, err.status);
    }
  }
}

type RankingProps = {
  rank: number;
  nickname: string;
  _id: string;
  atata_point: number;
};
