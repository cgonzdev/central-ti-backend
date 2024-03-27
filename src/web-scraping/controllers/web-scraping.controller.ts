import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { WSVulnerabilitiesService } from '../services/ws-vulnerabilities.service';
import { CreateWSVulnerabilitiesDto } from '../dtos/ws-vulnerabilities.dto';

import { MongoIdPipe } from '@/common/mongo-id.pipe';

@ApiTags('Web Scraping')
@Controller('web-scraping')
export class WSVulnerabilitiesController {
  constructor(private wsvService: WSVulnerabilitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ws vulnerabilities records' })
  getByPatient() {
    return this.wsvService.get();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ws vulnerabilities record' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.wsvService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a ws vulnerabilities record' })
  create(@Body() event: CreateWSVulnerabilitiesDto) {
    return this.wsvService.create(event);
  }
}
