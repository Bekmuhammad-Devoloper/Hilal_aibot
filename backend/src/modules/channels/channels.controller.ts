import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@ApiTags('Channels')
@Controller('api/channels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.channelsService.findById(id);
  }

  @Post()
  async create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.channelsService.delete(id);
    return { success: true };
  }

  @Post(':id/toggle-mandatory')
  async toggleMandatory(@Param('id') id: number) {
    return this.channelsService.toggleMandatory(id);
  }

  @Post(':id/toggle-active')
  async toggleActive(@Param('id') id: number) {
    return this.channelsService.toggleActive(id);
  }
}
