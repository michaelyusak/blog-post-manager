import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async registerUser(name: string, email: string, password: string) {
    const connection = this.dbService.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?);',
      [name, email.toLowerCase(), password],
    );

    return { id: result.insertId, name: name, email: email };
  }

  async findUserByEmail(userEmail: string): Promise<number> {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT user_id FROM users WHERE user_email = ? AND deleted_at IS NULL',
      [userEmail.toLowerCase()],
    );

    if (!results[0]) {
      return undefined;
    }

    return results[0].user_id;
  }

  async findUserById(id: number) {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT user_id FROM users WHERE user_id = ? AND deleted_at IS NULL;',
      [id],
    );

    return results;
  }

  async getUserPassword(userId: number): Promise<string> {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT user_password FROM users WHERE user_id = ?',
      [userId],
    );

    return results[0].user_password;
  }
}
