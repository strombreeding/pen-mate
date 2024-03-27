import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { GameRecord, GameRecordSchema } from './game_record.schema';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      {
        name: GameRecord.name,
        schema: GameRecordSchema,
      },
    ]),
    UserModule,
    InventoryModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
