import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { WebScrapingService } from '../services/web-scraping.service';
import { WebScrapingVulnDto } from '../dtos/web-scraping.dto';

@ApiTags('Web Scraping')
@Controller('web-scraping')
export class WebScrapingController {
  constructor(private scrapingService: WebScrapingService) {}

  @Post()
  @ApiOperation({ summary: '' })
  wsvuln(@Body() request: WebScrapingVulnDto) {
    return this.scrapingService.wsvuln(request);
  }
}
