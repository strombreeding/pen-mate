import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  // constructor(private userRepo: UserRepository) {}

  // async findAll() {
  //   return await this.userRepo.zz();
  // }

  /* 
    로컬 회원가입일 경우에 AC,AT 미발급
  */
  async create(create: any) {
    try {
    } catch (err) {}
  }

  async genHashPassword(passward: string) {
    return await bcrypt.hash(passward, process.env.HASH_SALT);
  }
  async comparePassword(passward: string) {
    const hashPw = await this.genHashPassword(passward);
    return await bcrypt.compare(passward, hashPw);
  }
}
