import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
