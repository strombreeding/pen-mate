import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<Item>,
  ) {}

  async findById(id: string) {
    const item = await this.itemModel.findById(id);
    return item;
  }

  async findAll() {
    const items = await this.itemModel.aggregate([
      {
        $match: {
          item_name: { $ne: 'atata_stone' },
        },
      },
      {
        $sort: {
          item_name: 1,
        },
      },
      {
        $group: {
          _id: '$usage',
          items: { $push: '$$ROOT' },
        },
      },
    ]);

    return items;
  }
  async createItem(data: {
    item_name: string;
    item_img: string;
    item_description: string;
    name: string;
    price: number;
    usage: string;
  }) {
    const result = await this.itemModel.create(data);
    return result;
  }

  async findByName(item_name: string) {
    try {
      const result = await this.itemModel.findOne({ item_name: item_name });
      return result;
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, err.status);
    }
  }
}
