import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';
import { parseTime } from 'src/utils/getParseTime';
import { CostObjProps } from 'src/types/record';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/inventory.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly inventoryService: InventoryService,
  ) {}

  async getAll() {
    const users = await this.userModel.find();
    return users;
  }

  async isOurUser(social_id?: any, nickname?: string) {
    const data = {
      ...(social_id && { social_id }),
      ...(nickname && { nickname }),
    };

    const user = await this.userModel.findOne(data);
    if (!user) return false;

    // console.log(user, '찾았다!');

    return user;
  }

  async login(data: {
    social_id?: string | null;
    email?: string | null;
    ip?: string;
  }) {
    const user = await this.userModel.findOne({ social_id: data.social_id });
    console.log(user);
    const [energy, atata_point, atata_stone] = await Promise.all([
      this.inventoryService.find({
        'item.item_name': 'energy',
        owner_id: user._id,
      }),
      this.inventoryService.find({
        'item.item_name': 'atata_point',
        owner_id: user._id,
      }),
      this.inventoryService.find({
        'item.item_name': 'atata_stone',
        owner_id: user._id,
      }),
    ]);

    console.log('################', energy, atata_point, atata_stone);
    if (!user) throw new Error('404');
    const payload = {
      id: user.id,
      nickname: user.nickname,
    };
    console.log(energy[0]);
    const userCostState = {
      energy: energy[0].cnt,
      atata_point: atata_point[0].cnt,
      atata_stone: atata_stone[0].cnt,
    };

    const at = generateToken(payload);
    const rt = generateToken(payload, '4w');
    user.rt = rt;
    user.save();
    console.log(userCostState);
    return { ...payload, ...userCostState, at, rt };
  }

  async refreshToken(rt: string) {
    try {
      const validate = verifyToken(rt);
      const { exp, iat, ...rest } = validate;
      const newRt = generateToken(rest, '4w');
      const newAt = generateToken(rest);
      const user = await this.userModel.findOne({ rt });
      if (!user) throw new HttpException('위조된RT', 401);

      user.rt = newRt;
      user.save();
      const [energy, atata_point, atata_stone] = await Promise.all([
        this.inventoryService.find({
          'item.item_name': 'energy',
          owner_id: user._id,
        }),
        this.inventoryService.find({
          'item.item_name': 'atata_point',
          owner_id: user._id,
        }),
        this.inventoryService.find({
          'item.item_name': 'atata_stone',
          owner_id: user._id,
        }),
      ]);
      const userCostState = {
        energy: energy[0].cnt,
        atata_point: atata_point[0].cnt,
        atata_stone: atata_stone[0].cnt,
      };

      console.log(userCostState);
      return { rt: newRt, at: newAt, ...userCostState };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }

    return;
  }

  async create(nickname: string, id?: string, email?: string) {
    try {
      const data = {
        _id: new mongoose.Types.ObjectId(),
        ...(nickname && { nickname }),
        ...(id && { social_id: id }),
        ...(email && { email }),
      };
      console.log('create');
      const duplicate = await this.isDuplicateId(nickname);
      if (duplicate)
        throw new HttpException('이미 존재하는 닉네임 입니다.', 400);

      const newUser = await this.userModel.create(data);
      const defaultItems = [
        { item_name: 'atata_stone', cnt: 0 },
        { item_name: 'energy', cnt: 5 },
        { item_name: 'atata_point', cnt: 0 },
      ];
      const addItems = await this.inventoryService.addNewItem(
        new mongoose.Types.ObjectId(newUser._id),
        defaultItems,
      );

      const payload = {
        nickname: newUser.nickname,
        id: newUser.id,
      };
      const userCostState = {
        atata_stone: addItems[0].cnt,
        energy: addItems[1].cnt,
        atata_point: addItems[2].cnt,
      };
      const at = generateToken(payload);
      const rt = generateToken(payload, '4w');
      newUser.rt = rt;
      newUser.save();

      console.log('create return');
      return { ...payload, ...userCostState, at, rt };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        '회원가입중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string) {
    try {
      const user = await this.userModel.findById(
        new mongoose.Types.ObjectId(id),
      );
      return user;
    } catch (err) {}
  }

  async isDuplicateId(nickname: string) {
    // 키값으로 찾기
    try {
      const isUser = await this.userModel.findOne({ nickname: nickname });
      console.log(isUser, '이미 있냐?');
      if (isUser == null) return false;

      return true;
    } catch (err) {
      console.log(err.message);
      throw new Error('서버에러');
    }
  }

  async checkCost(costObj: CostObjProps[], at: string) {
    try {
      const tokenVerify = verifyToken(at);
      const inventory = await this.inventoryService.find({
        owner_id: new mongoose.Types.ObjectId(tokenVerify.id),
      });

      // 코스트 검증 및 업데이트 객체에 추가
      inventory.map((inventoryItem, i) => {
        costObj.map((obj: CostObjProps, i) => {
          if (
            obj.type === inventoryItem.item.item_name &&
            inventoryItem.cnt < obj.cost
          ) {
            throw new HttpException('not enough energy', 400);
          }
        });
      });

      return true;
    } catch (err) {
      if (err.message.includes('jwt expired')) {
        throw new HttpException('jwt expired', 401);
      }
      if (err.message.includes('invalid signature')) {
        throw new HttpException('invalid signature', 401);
      }
      if (err.message.includes('not enough')) {
        throw new HttpException(err.message, 400);
      }
      console.log(err);
      throw new Error(err);
    }
  }

  async findOneAndUpdate(_id: Types.ObjectId, update: any) {
    const zz = await this.userModel.findOneAndUpdate({ _id }, { $set: update });
    return zz;
  }
}
// JWT 생성 함수
export function generateToken(payload: Record<string, any>, expire?: string) {
  // const exp = expire == null ? 10000 : parseTime(expire);
  const newPayload = { ...payload };
  const token = jwt.sign(newPayload, process.env.JWT_SECRET_KEY, {
    expiresIn: expire == null ? parseTime('120s') : parseTime(expire),
    // expiresIn: expire == null ? parseTime('1s') : parseTime(expire),
  });
  return token;
}

// JWT 검증 함수
export function verifyToken(token: string) {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { ...decoded };
  } catch (err) {
    if (err.message.includes('jwt')) {
      throw new HttpException('jwt expired', 401);
    }
    if (err.message.includes('invalid signature')) {
      throw new HttpException('invalid signature', 401);
    }
  }
}
