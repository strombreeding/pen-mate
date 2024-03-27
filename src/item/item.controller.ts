import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async viewAllItems() {
    const allItem = await this.itemService.findAll();
    return allItem;
  }

  @Post('/new')
  async addNewItem(@Body() data: any) {
    const result = await this.itemService.createItem(data);
    return result;
  }
}
