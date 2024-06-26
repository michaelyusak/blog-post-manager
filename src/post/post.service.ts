import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from 'src/database.service';
import { response } from './dto/response';

@Injectable()
export class PostService {
  constructor(private readonly dbService: DatabaseService) {}

  async createOnePost(authorId: number, content: string) {
    const connection = this.dbService.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO posts (content, author_id) VALUES (?, ?)',
      [content, authorId],
    );

    const response: response = {
      message: `Successfully created a post with id #${result.insertId}`,
      data: null,
    };

    return response;
  }

  async findAllPost() {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT p.post_id, p.author_id, u.user_name as author_name, p.content, p.created_at, p.updated_at FROM posts p JOIN users u  ON u.user_id = p.author_id WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL;',
    );

    return results;
  }

  async findOnePost(id: number) {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT p.post_id, p.author_id, u.user_name as author_name, p.content, p.created_at, p.updated_at FROM posts p JOIN users u ON u.user_id = p.author_id WHERE p.post_id = ? AND p.deleted_at IS NULL AND u.deleted_at IS NULL;',
      [id],
    );

    if (!results[0]) {
      return undefined;
    }

    return results;
  }

  async updateOnePost(id: number, content: string) {
    const connection = this.dbService.getConnection();

    await connection.execute(
      'UPDATE posts SET content = ?, updated_at = NOW() WHERE post_id = ? AND deleted_at IS NULL',
      [content, id],
    );

    const response: response = {
      message: `#${id} post successfully updated`,
      data: null,
    };

    return response;
  }

  async removeOnePost(id: number) {
    const connection = this.dbService.getConnection();

    await connection.execute(
      'UPDATE posts SET deleted_at = NOW(), updated_at = NOW() WHERE post_id = ? AND deleted_at IS NULL',
      [id],
    );

    const response: response = {
      message: `#${id}post successfully deleted`,
      data: null,
    };

    return response;
  }
}
