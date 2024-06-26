import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { response } from './dto/response';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private bcrypt = require('bcrypt');

  private dotenv = require('dotenv');

  private saltRounds = process.env.SALT_ROUNDS;

  private jwt = require('jsonwebtoken');

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<response> {
    this.dotenv.config();

    if (
      !createUserDto.email ||
      !createUserDto.name ||
      !createUserDto.password
    ) {
      throw new HttpException('data incomplete', HttpStatus.BAD_REQUEST);
    }

    const existingUserId = await this.userService.findUser(createUserDto.email);

    if (existingUserId) {
      throw new HttpException('email already registered', HttpStatus.FORBIDDEN);
    }

    const salt = this.bcrypt.genSaltSync(this.saltRounds);
    const hash = this.bcrypt.hashSync(createUserDto.password, salt);

    const result = this.userService.registerUser(
      createUserDto.name,
      createUserDto.email,
      hash,
    );

    return { message: 'user successfully registered', data: result };
  }

  @Get()
  async Login(@Body() loginDto: LoginDto): Promise<response> {
    this.dotenv.config();

    if (!loginDto.email || !loginDto.password) {
      throw new HttpException('data incomplete', HttpStatus.BAD_REQUEST);
    }

    const existingUserId = await this.userService.findUser(loginDto.email);

    if (!existingUserId) {
      throw new HttpException('email not registered', HttpStatus.UNAUTHORIZED);
    }

    const hash = await this.userService.getUserPassword(existingUserId);

    if (!this.bcrypt.compareSync(loginDto.password, hash)) {
      throw new HttpException('wrong password', HttpStatus.UNAUTHORIZED);
    }

    const now = new Date();
    const expiredAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const data = JSON.stringify({
      userId: existingUserId,
    });

    const claims = {
      iat: now.getTime() * 1000,
      iss: process.env.ISSUER,
      exp: expiredAt.getTime() * 1000,
      data: data,
    };

    const token = this.jwt.sign(claims, process.env.JWT_SECRET);

    return { message: 'Login success', data: { token: `Bearer ${token}` } };
  }
}
