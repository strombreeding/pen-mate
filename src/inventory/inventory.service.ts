import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
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

  async addNewItem(
    owner_id: Types.ObjectId | string,
    itemList: { itemName: string; cnt: number }[],
  ) {
    console.log('inventory addNewItem', owner_id);
    try {
      const getItemList = await Promise.all(
        itemList.map((item) => this.itemService.findByName(item.itemName)),
      );

      // 아이템들 리스트를 찾았으니 이 리스트를 itemList를 반복하며 넣어주면 됨
      const addProcess = getItemList.map((item, index) => {
        console.log(itemList[index].itemName, itemList[index].cnt);
        return this.inventoryModel.findOneAndUpdate(
          {
            owner_id: owner_id,
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
      // console.log(results, '인벤토리 아이템 추가내역');
      return results;
    } catch (err) {
      console.log(err, 'inventory_addNewItem');
      throw new HttpException(err.message, err.status);
    }
  }
}
