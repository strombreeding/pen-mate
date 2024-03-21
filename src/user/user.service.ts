import { HttpException, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';
import { parseTime } from 'src/utils/getParseTime';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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
  // async findAll() {
  //   return await this.userRepo.zz();
  // }

  /* 
    로컬 회원가입일 경우에 AC,AT 미발급
  */
  // toUpdate = {
  //   ...(name && { name }),
  //   ...(password && { password }),
  //   ...(address && { address }),
  //   ...(phoneNumber && { phoneNumber }),
  // }; //
  async login(data: {
    social_id?: string | null;
    email?: string | null;
    ip?: string;
  }) {
    const zz = {
      ...(data.social_id && { social_id: data.social_id }),
      ...(data.email && { email: data.email }),
    };
    const user = await this.userModel.findOne(zz);
    console.log(user);
    if (!user) throw new Error('404');
    const payload = {
      id: user.id,
      nickname: user.nickname,
      energy: user.energy,
      atataPoint: user.atata_point,
      atataStone: user.atata_stone,
    };
    const at = this.generateToken(payload);
    const rt = this.generateToken(payload, '4w');
    user.rt = rt;
    user.save();

    return { ...payload, at, rt };
  }

  async refreshToken(rt: string): Promise<{ at: string; rt: string }> {
    try {
      console.log(rt);
      const validate = this.verifyToken(rt);
      const { exp, iat, ...rest } = validate;
      const newRt = this.generateToken(rest, '4w');
      const newAt = this.generateToken(rest);
      const user = await this.userModel.findOne({ rt });
      console.log(user);
      if (!user) throw new HttpException('위조된RT', 403);

      user.rt = newRt;
      user.save();

      return { rt: newRt, at: newAt };
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
      console.log(newUser._id);
      const user = await this.userModel.findOne({ _id: newUser._id });
      console.log(user);
      const payload = {
        nickname: newUser.nickname,
        id: newUser.id,
        energy: 5,
        atataPoint: 0,
        atataStone: 0,
      };
      const at = this.generateToken(payload);
      const rt = this.generateToken(payload, '4w');
      user.rt = rt;
      user.save();

      console.log('create return');
      return { ...payload, at, rt };
    } catch (err) {
      console.log(err.message);
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

  async genHashPassword(passward: string) {
    return await bcrypt.hash(passward, process.env.HASH_SALT);
  }
  async comparePassword(passward: string) {
    const hashPw = await this.genHashPassword(passward);
    return await bcrypt.compare(passward, hashPw);
  }

  // JWT 생성 함수
  generateToken(payload: Record<string, any>, expire?: string) {
    // const exp = expire == null ? 10000 : parseTime(expire);
    const newPayload = { ...payload };
    const token = jwt.sign(newPayload, process.env.JWT_SECRET_KEY, {
      // expiresIn: expire == null ? parseTime("1s") : expire,
      expiresIn: expire == null ? parseTime('10s') : parseTime(expire),
    });
    return token;
  }

  // JWT 검증 함수
  verifyToken(token: string): any {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  }
}
