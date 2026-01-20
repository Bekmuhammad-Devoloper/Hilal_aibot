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
    console.log('[ChannelsService] Creating channel with data:', JSON.stringify(data));
    try {
      const channel = this.channelRepository.create(data);
      console.log('[ChannelsService] Channel entity created:', JSON.stringify(channel));
      const saved = await this.channelRepository.save(channel);
      console.log('[ChannelsService] Channel saved to DB:', JSON.stringify(saved));
      return saved;
    } catch (error: any) {
      console.error('[ChannelsService] Create error:', error.message);
      console.error('[ChannelsService] Error stack:', error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Channel[]> {
    console.log('[ChannelsService] Finding all channels');
    try {
      const channels = await this.channelRepository.find({
        order: { createdAt: 'DESC' },
      });
      console.log('[ChannelsService] Found', channels.length, 'channels');
      return channels;
    } catch (error: any) {
      console.error('[ChannelsService] FindAll error:', error.message);
      throw error;
    }
  }

  async findById(id: number): Promise<Channel | null> {
    console.log('[ChannelsService] Finding channel by ID:', id);
    return this.channelRepository.findOne({ where: { id } });
  }

  async getMandatoryChannels(): Promise<Channel[]> {
    return this.channelRepository.find({
      where: { isMandatory: true, isActive: true },
    });
  }

  async update(id: number, data: Partial<Channel>): Promise<Channel | null> {
    console.log('[ChannelsService] Updating channel', id, 'with data:', JSON.stringify(data));
    try {
      await this.channelRepository.update(id, data);
      const updated = await this.findById(id);
      console.log('[ChannelsService] Channel updated:', JSON.stringify(updated));
      return updated;
    } catch (error: any) {
      console.error('[ChannelsService] Update error:', error.message);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    console.log('[ChannelsService] Deleting channel', id);
    await this.channelRepository.delete(id);
  }

  async toggleMandatory(id: number): Promise<Channel | null> {
    const channel = await this.findById(id);
    if (channel) {
      channel.isMandatory = !channel.isMandatory;
      await this.channelRepository.save(channel);
      console.log('[ChannelsService] Toggled mandatory for channel', id, ':', channel.isMandatory);
    }
    return channel;
  }

  async toggleActive(id: number): Promise<Channel | null> {
    const channel = await this.findById(id);
    if (channel) {
      channel.isActive = !channel.isActive;
      await this.channelRepository.save(channel);
      console.log('[ChannelsService] Toggled active for channel', id, ':', channel.isActive);
    }
    return channel;
  }
}
