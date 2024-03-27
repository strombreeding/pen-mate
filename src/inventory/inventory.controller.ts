import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { FilterQuery } from 'mongoose';
import { Inventory } from './inventory.schema';
import { UserService, verifyToken } from 'src/user/user.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async getMyInventory(@Body() body: { at: string }) {
    try {
      const token = await verifyToken(body.at);
      const condition: FilterQuery<Inventory> = {
        owner_id: token.id,
        cnt: { $ne: 0 },
        name: { $nin: ['atata_stone', 'atata_point', 'energy'] },
      };
      const result = await this.inventoryService.find(condition);
      console.log(result, 'ㅎㅇ');
      return result;
    } catch (err) {
      console.log(err.status);
      throw new HttpException(err.message, err.status);
    }
  }
}
