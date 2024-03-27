import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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

    const [energy, atataPoint, atataStone] = await Promise.all([
      this.inventoryService.find({
        'item.item_name': 'energy',
        owner_id: user.id,
      }),
      this.inventoryService.find({
        'item.item_name': 'atata_point',
        owner_id: user.id,
      }),
      this.inventoryService.find({
        'item.item_name': 'atata_stone',
        owner_id: user.id,
      }),
    ]);

    console.log('################', energy, atataPoint, atataStone);
    if (!user) throw new Error('404');
    const payload = {
      id: user.id,
      nickname: user.nickname,
    };
    console.log(energy[0]);
    const userCostState = {
      energy: energy[0].cnt,
      atataPoint: atataPoint[0].cnt,
      atataStone: atataStone[0].cnt,
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
      if (!user) throw new HttpException('위조된RT', 403);

      user.rt = newRt;
      user.save();
      const [energy, atataPoint, atataStone] = await Promise.all([
        this.inventoryService.find({
          'item.item_name': 'energy',
          owner_id: user.id,
        }),
        this.inventoryService.find({
          'item.item_name': 'atata_point',
          owner_id: user.id,
        }),
        this.inventoryService.find({
          'item.item_name': 'atata_stone',
          owner_id: user.id,
        }),
      ]);
      const userCostState = {
        energy: energy[0].cnt,
        atataPoint: atataPoint[0].cnt,
        atataStone: atataStone[0].cnt,
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
        ...(nickname && { nickname }),
        ...(id && { social_id: id }),
        ...(email && { email }),
      };
      console.log('create');
      const duplicate = await this.isDuplicateId(nickname);
      if (duplicate)
        throw new HttpException('이미 존재하는 닉네임 입니다.', 400);

      const newUser = await this.userModel.create({ ...data });

      const defaultItems = [
        { itemName: 'atata_stone', cnt: 0 },
        { itemName: 'energy', cnt: 5 },
        { itemName: 'atata_point', cnt: 0 },
      ];
      const addItems = await this.inventoryService.addNewItem(
        newUser._id,
        defaultItems,
      );

      const payload = {
        nickname: newUser.nickname,
        id: newUser.id,
      };
      const userCostState = {
        atataStone: addItems[0].cnt,
        energy: addItems[1].cnt,
        atataPoint: addItems[2].cnt,
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
      const user = await this.userModel.findById(id);
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
      const user = await this.getById(tokenVerify.id);
      if (!user) throw new HttpException('not found', 404);
      const energy = await this.inventoryService.find({
        'item.item_name': 'energy',
        owner_id: user.id,
      })[0];

      const atataStone = await this.inventoryService.find({
        'item.item_name': 'atata_stone',
        owner_id: user.id,
      })[0];
      // 코스트 검증 및 업데이트 객체에 추가
      costObj.map((obj: CostObjProps, i) => {
        if (obj.type === 'energy' && energy < obj.cost) {
          throw new HttpException('not enough energy', 400);
        }

        if (obj.type === 'atata_stone' && atataStone < obj.cost) {
          throw new HttpException('not enough atataStone', 400);
        }
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
}
// JWT 생성 함수
export function generateToken(payload: Record<string, any>, expire?: string) {
  // const exp = expire == null ? 10000 : parseTime(expire);
  const newPayload = { ...payload };
  const token = jwt.sign(newPayload, process.env.JWT_SECRET_KEY, {
    // expiresIn: expire == null ? parseTime("1s") : expire,
    expiresIn: expire == null ? parseTime('1s') : parseTime(expire),
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
