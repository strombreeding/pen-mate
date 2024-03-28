import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './payment.schema';
import mongoose, { Model } from 'mongoose';
import { UserService, verifyToken } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { InventoryService } from 'src/inventory/inventory.service';
type ItemProps = {
  price: number;
  _id: string;
  cnt: number;
  item_name: string;
};
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly itemService: ItemService,
    private readonly inventoryService: InventoryService,
    private readonly userService: UserService,
  ) {}

  async createPayment(item: ItemProps, at: string) {
    try {
      const token = verifyToken(at);
      const buyer_id = new mongoose.Types.ObjectId(token.id);
      const itemInfo = await this.itemService.findById(item._id);
      const currentInventory = await this.inventoryService.find({
        owner_id: buyer_id,
        // $or: [
        //   { 'item.item_name': itemInfo.item_name },
        //   { 'item.item_name': 'atata_stone' },
        // ],
      });

      const itemPrice = itemInfo.price;
      console.log(item, 'item');
      console.log(itemPrice, '아이템 가격');
      // 그리고
      let updateCnt = item.cnt;
      let afterCost = 0;

      currentInventory.map((curInventory) => {
        console.log(curInventory.item.item_name, item.item_name);
        if (
          curInventory.item.item_name === 'atata_stone' &&
          curInventory.cnt < itemPrice * item.cnt // 가진 재화가 아이템 가격보다 작을때
        ) {
          throw new HttpException('not enough', 400);
        }
        if (curInventory.item.item_name === 'atata_stone') {
          afterCost = curInventory.cnt - itemPrice * item.cnt;
        }
        if (item.item_name === curInventory.item.item_name) {
          updateCnt = curInventory.cnt + item.cnt;
        }
      });
      const createObject = {
        buyer_id,
        cnt: item.cnt,
        cost_atata_stone: item.cnt * itemInfo.price,
        item_id: itemInfo._id.toString(),
      };
      const created = await this.paymentModel.create(createObject);

      const inventoryProcess = await this.inventoryService.addNewItem(
        buyer_id,
        [
          { item_name: item.item_name, cnt: updateCnt },
          { item_name: 'atata_stone', cnt: afterCost },
        ],
      );

      const updateSource = {};
      updateSource[inventoryProcess[0].item.item_name] =
        inventoryProcess[0].cnt;
      updateSource['atata_stone'] = afterCost;
      console.log(inventoryProcess[0], '결과');
      return { updateSource, result: inventoryProcess[0] };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }
}
