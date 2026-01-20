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
    console.log('=== POSTS: GET ALL ===');
    const posts = await this.postsService.findAll();
    console.log('Posts count:', posts.length);
    return posts;
  }

  @Get('stats')
  async getStats() {
    console.log('=== POSTS: GET STATS ===');
    return this.postsService.getStats();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    console.log('=== POSTS: GET BY ID ===', id);
    return this.postsService.findById(id);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log('=== POSTS: CREATE ===');
    console.log('Request body:', JSON.stringify(createPostDto));
    try {
      const post = await this.postsService.create(createPostDto);
      console.log('Post created:', JSON.stringify(post));
      return post;
    } catch (error: any) {
      console.error('Post create error:', error.message);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    console.log('=== POSTS: UPDATE ===', id);
    console.log('Request body:', JSON.stringify(updatePostDto));
    try {
      const post = await this.postsService.update(id, updatePostDto);
      console.log('Post updated:', JSON.stringify(post));
      return post;
    } catch (error: any) {
      console.error('Post update error:', error.message);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    console.log('=== POSTS: DELETE ===', id);
    await this.postsService.delete(id);
    console.log('Post deleted');
    return { success: true };
  }

  @Post(':id/send')
  async sendPost(@Param('id') id: number, @Body() sendPostDto: SendPostDto) {
    console.log('=== POSTS: SEND ===', id);
    console.log('Send to channel:', sendPostDto.channelId);
    try {
      const result = await this.postsService.sendPost(id, sendPostDto.channelId);
      console.log('Post sent result:', JSON.stringify(result));
      return result;
    } catch (error: any) {
      console.error('Post send error:', error.message);
      throw error;
    }
  }

  @Post(':id/broadcast')
  async broadcastPost(@Param('id') id: number) {
    console.log('=== POSTS: BROADCAST ===', id);
    try {
      const result = await this.postsService.broadcastPost(id);
      console.log('Broadcast result:', result);
      return result;
    } catch (error: any) {
      console.error('Broadcast error:', error.message);
      throw error;
    }
  }

  @Post(':id/schedule')
  async schedulePost(@Param('id') id: number, @Body() body: { scheduledAt: string; broadcastToUsers?: boolean }) {
    console.log('=== POSTS: SCHEDULE ===', id);
    console.log('Schedule at:', body.scheduledAt, 'Broadcast:', body.broadcastToUsers);
    try {
      const result = await this.postsService.schedulePost(id, new Date(body.scheduledAt), body.broadcastToUsers);
      console.log('Schedule result:', JSON.stringify(result));
      return result;
    } catch (error: any) {
      console.error('Schedule error:', error.message);
      throw error;
    }
  }
}
