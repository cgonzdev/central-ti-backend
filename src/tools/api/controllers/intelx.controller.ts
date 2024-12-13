import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntelxService } from '../services/intelx.service';

import { SearchIntelxDto } from '../dtos/intelx.dto';

@ApiTags('API for Intelligence X search operations')
@Controller('tools/api/intelx')
export class IntelxController {
  constructor(private intelxService: IntelxService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search data in the IntelX API' })
  getOne(@Body() term: SearchIntelxDto) {
    return this.intelxService.search(term);
  }
}
