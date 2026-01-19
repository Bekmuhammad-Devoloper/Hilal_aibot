import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, SendPostDto } from './dto/post.dto';

@ApiTags('Posts')
@Controller('api/posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.postsService.getStats();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.postsService.findById(id);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.postsService.delete(id);
    return { success: true };
  }

  @Post(':id/send')
  async sendPost(@Param('id') id: number, @Body() sendPostDto: SendPostDto) {
    return this.postsService.sendPost(id, sendPostDto.channelId);
  }
}
