import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InfoUsersService } from '../services/info-users.service';
import {
  CreateInfoUsersDto,
  CreateManyInfoUsersDto,
  GetInfoUsersDto,
} from '../dtos/info-users.dto';

@ApiTags('Users Information')
@Controller('info/users')
export class InfoUsersController {
  constructor(private iuService: InfoUsersService) {}

  @Post('getOne')
  @ApiOperation({ summary: 'Get one specific user info' })
  getOne(@Body() userInfo: GetInfoUsersDto) {
    return this.iuService.getOne(userInfo);
  }

  @Post()
  @ApiOperation({ summary: 'Create one specific user info' })
  create(@Body() userInfo: CreateInfoUsersDto) {
    return this.iuService.create(userInfo);
  }

  @Post('many')
  @ApiOperation({ summary: 'Create many users info' })
  createMany(@Body() many: CreateManyInfoUsersDto) {
    return this.iuService.createMany(many);
  }
}
