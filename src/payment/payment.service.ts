import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './payment.schema';
import { Model } from 'mongoose';
import { verifyToken } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { InventoryService } from 'src/inventory/inventory.service';
type ItemProps = {
  price: number;
  _id: string;
  cnt: number;
};
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly itemService: ItemService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createPayment(item: ItemProps, at: string) {
    try {
      const token = verifyToken(at);
      const buyer_id = token.id;
      const itemInfo = await this.itemService.findById(item._id);
      const createObject = {
        buyer_id,
        cnt: item.cnt,
        cost_atata_stone: item.cnt * itemInfo.price,
        item_id: itemInfo._id.toString(),
      };
      const created = await this.paymentModel.create(createObject);
      const currentInventory = await this.inventoryService.find({
        owner_id: buyer_id,
        'item.item_name': itemInfo.item_name,
      });
      let updateCnt = item.cnt;
      if (currentInventory) {
        updateCnt = currentInventory[0].cnt + item.cnt;
      }

      const inventoryProcess = await this.inventoryService.addNewItem(
        buyer_id,
        [{ itemName: itemInfo.item_name, cnt: updateCnt }],
      );
      console.log(created);
      console.log(inventoryProcess);

      return created;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }
}
