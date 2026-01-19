import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(data: Partial<Channel>): Promise<Channel> {
    const channel = this.channelRepository.create(data);
    return this.channelRepository.save(channel);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Channel | null> {
    return this.channelRepository.findOne({ where: { id } });
  }

  async getMandatoryChannels(): Promise<Channel[]> {
    return this.channelRepository.find({
      where: { isMandatory: true, isActive: true },
    });
  }

  async update(id: number, data: Partial<Channel>): Promise<Channel | null> {
    await this.channelRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }

  async toggleMandatory(id: number): Promise<Channel | null> {
    const channel = await this.findById(id);
    if (channel) {
      channel.isMandatory = !channel.isMandatory;
      await this.channelRepository.save(channel);
    }
    return channel;
  }

  async toggleActive(id: number): Promise<Channel | null> {
    const channel = await this.findById(id);
    if (channel) {
      channel.isActive = !channel.isActive;
      await this.channelRepository.save(channel);
    }
    return channel;
  }
}
