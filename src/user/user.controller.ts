import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { response } from './dto/response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): response {
    if (
      !createUserDto.email ||
      !createUserDto.name ||
      !createUserDto.password
    ) {
      throw new HttpException('data incomplete', HttpStatus.BAD_REQUEST);
    }

    const existingUserId = this.userService.findUser(createUserDto.email);

    if (existingUserId) {
      throw new HttpException('email already registered', HttpStatus.FORBIDDEN);
    }

    const result = this.userService.registerUser(createUserDto);

    return { message: 'user successfully registered', data: result };
  }
}
