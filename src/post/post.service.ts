import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database.service';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll() {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT p.post_id, p.author_id, u.user_name as author_name, p.content, p.created_at, p.updated_at FROM posts p JOIN users u  ON u.user_id = p.author_id WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL;',
    );

    return results;
  }

  async findOne(id: number) {
    const connection = this.dbService.getConnection();

    const [results] = await connection.execute(
      'SELECT p.post_id, p.author_id, u.user_name as author_name, p.content, p.created_at, p.updated_at FROM posts p JOIN users u ON u.user_id = p.author_id WHERE p.post_id = ? AND p.deleted_at IS NULL AND u.deleted_at IS NULL;',
      [id],
    );

    return results;
  }

  async update(id: number, content: string) {
    const connection = this.dbService.getConnection();

    await connection.execute(
      'UPDATE posts SET content = ? WHERE post_id = ? AND deleted_at IS NULL',
      [content, id],
    );

    return `#${id} post successfully updated`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
