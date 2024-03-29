import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import mongoose, { FilterQuery, PipelineStage } from 'mongoose';
import { Inventory } from './inventory.schema';
import { UserService, verifyToken } from 'src/user/user.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/my')
  async getMyInventory(@Req() req: any) {
    const { type } = req.query;
    console.log(type, '타입');
    try {
      const token = verifyToken(req.headers.authorization.split(' ')[1]);
      const condition: FilterQuery<Inventory> = {
        owner_id: new mongoose.Types.ObjectId(token.id),
        cnt: { $ne: 0 },
        'item.item_name': { $nin: ['atata_stone', 'energy'] },
        ...(type && { 'item.usage': type }),
      };
      const result = await this.inventoryService.find(condition);
      // console.log(result, 'ㅎㅇ');
      return result;
    } catch (err) {
      console.log(err.status);
      throw new HttpException(err.message, err.status);
    }
  }

  @Get()
  async getAllAtataPoint(@Req() req: any) {
    console.log(req.headers.authorization.split(' ')[1], '샵새끼야');
    try {
      const token = verifyToken(req.headers.authorization.split(' ')[1]);

      const { allUserRankings, myRank } =
        await this.inventoryService.getAllIventoryForRanking(token.id);

      return { allUserRankings, myRank };
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, err.status);
    }
  }

  @Post()
  async setIventory(
    @Body() body: { data: { cnt: number; item_name: string }[] },
    @Req() req: any,
  ) {
    const token = verifyToken(req.headers.authorization.split(' ')[1]);

    try {
      const res = await this.inventoryService.addNewItem(
        new mongoose.Types.ObjectId(token.id),
        body.data,
      );
      console.log(res);
      return res;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
