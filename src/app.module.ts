import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { connection } from './configs/db';
import { SocialModule } from './social/social.module';
import { GameModule } from './game/game.module';
import { RankingsModule } from './rankings/rankings.module';
import { StoreModule } from './store/store.module';
import { GameRecordModule } from './game-record/game-record.module';
import { ItemModule } from './item/item.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentModule } from './payment/payment.module';
import { MongooseModule } from '@nestjs/mongoose';
//
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_DB,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PWD,
    }),
    ConfigModule.forRoot(),
    // UserModule,
    // LetterModule,
    SocialModule,
    GameModule,
    RankingsModule,
    StoreModule,
    GameRecordModule,
    ItemModule,
    InventoryModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
