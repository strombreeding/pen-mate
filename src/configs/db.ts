import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
export const SERVER_URL = process.env.SERVER_URL;

const DB_URL = process.env.DB_URL;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const DB_NAME = process.env.DB_NAME;
export const connection: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_URL,
  port: 5432,
  username: DB_USER,
  password: DB_PW,
  database: DB_NAME,
  entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
  synchronize: true,
};
