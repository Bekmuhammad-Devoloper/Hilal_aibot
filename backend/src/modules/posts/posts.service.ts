import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { BotService } from '../bot/bot.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(forwardRef(() => BotService))
    private botService: BotService,
  ) {}

  async create(data: Partial<Post>): Promise<Post> {
    const post = this.postRepository.create(data);
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Post>): Promise<Post | null> {
    await this.postRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async sendPost(id: number, channelId: string): Promise<Post | null> {
    const post = await this.findById(id);
    if (!post) return null;

    try {
      let result: any;

      if (post.type === 'photo' && post.mediaUrl) {
        result = await this.botService.sendPhotoToChannel(
          channelId,
          post.mediaUrl,
          post.content,
        );
      } else {
        result = await this.botService.sendMessageToChannel(
          channelId,
          post.content,
          { parse_mode: 'HTML' },
        );
      }

      post.status = 'sent';
      post.sentAt = new Date();
      post.channelId = channelId;
      post.messageId = String(result.message_id);
      await this.postRepository.save(post);

      return post;
    } catch (error) {
      post.status = 'failed';
      await this.postRepository.save(post);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    const total = await this.postRepository.count();
    const sent = await this.postRepository.count({ where: { status: 'sent' } });
    const draft = await this.postRepository.count({ where: { status: 'draft' } });
    const failed = await this.postRepository.count({ where: { status: 'failed' } });

    return { total, sent, draft, failed };
  }
}
