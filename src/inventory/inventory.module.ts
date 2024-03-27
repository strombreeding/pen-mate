import { Module, forwardRef } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemModule } from 'src/item/item.module';
import { Inventory, InventorySchema } from './inventory.schema';
import { InventoryController } from './inventory.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    ItemModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
