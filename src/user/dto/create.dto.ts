// user.dto.ts
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Language } from 'src/types/user';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  nation: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsArray()
  language: Language[];
  @IsNotEmpty()
  @IsArray()
  interest: string[];

  @IsOptional()
  @IsString()
  mbti?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
