import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostGuard } from './post.guard';
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(PostGuard)
  @Post()
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    const existingUser = this.userService.findUserById(req.userId);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    return this.postService.createOnePost(req.userId, createPostDto.content);
  }

  @Get()
  findAll() {
    return this.postService.findAllPost();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOnePost(+id);
  }

  @UseGuards(PostGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const existingPost = await this.findOne(id);

    if (existingPost[0].author_id != req.userId) {
      throw new UnauthorizedException();
    }

    return this.postService.updateOnePost(+id, updatePostDto.content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.removeOnePost(+id);
  }
}
