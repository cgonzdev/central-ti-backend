import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { MongoIdPipe } from '../../common/mongo-id.pipe';

@Controller('auth/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  get() {
    return this.userService.get();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.userService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create one user' })
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update one user' })
  update(@Param('id', MongoIdPipe) id: string, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one user' })
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.userService.delete(id);
  }
}
