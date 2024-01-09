import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const DB_URL = 'mongodb://jiny:123123@13.125.251.140:27017';
// export const DB_URL = process.env.MONGODB_URL;
async function bootstrap() {
  console.log(process.env.HASH_SALT);
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
}
bootstrap();
