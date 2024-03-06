import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { join } from 'path';
import { connection } from './configs/db';
import { SocialModule } from './social/social.module';
import { GameModule } from './game/game.module';
import { RankingsModule } from './rankings/rankings.module';
import { StoreModule } from './store/store.module';
//
console.log(connection, '??');
@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://13.125.251.140:27017'),
    // TypeOrmModule.forRoot(connection),
    ConfigModule.forRoot(),
    // UserModule,
    // LetterModule,
    // SocialModule,
    GameModule,
    RankingsModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
