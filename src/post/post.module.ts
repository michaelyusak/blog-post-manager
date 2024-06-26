import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseService } from 'src/database.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [PostController],
  providers: [PostService, UserService, DatabaseService],
})
export class PostModule {}
