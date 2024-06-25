import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database.service';
import { ResultSetHeader } from 'mysql2';

import bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async registerUser(userDTO: CreateUserDto) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(userDTO.password, salt);
    const connection = this.dbService.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?);',
      [userDTO.name, userDTO.email.toLowerCase(), hash],
    );

    return { id: result.insertId, name: userDTO.name, email: userDTO.email };
  }

  async findUser(userEmail: string): Promise<number> {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT user_id FROM users WHERE user_email LIKE ?',
      [userEmail.toLowerCase()],
    );

    return results[0].user_id;
  }
}
