import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
