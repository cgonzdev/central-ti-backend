import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersScopeService } from '../services/customers-scope.service';
import {
  CreateCustomerScopeDto,
  UpdateCustomerScopeDto,
} from '../dtos/customers-scope.dto';

import { MongoIdPipe } from '../../common/mongo-id.pipe';

@ApiTags('Customers Scope Information')
@Controller('info/customers-scope')
export class CustomersScopeController {
  constructor(private csService: CustomersScopeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all of scope about the customers' })
  get() {
    return this.csService.get();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one specific customer scope' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.csService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create one specific customer scope' })
  create(@Body() scope: CreateCustomerScopeDto) {
    return this.csService.create(scope);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update one specific customer scope' })
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() scope: UpdateCustomerScopeDto,
  ) {
    return this.csService.update(id, scope);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one specific customer scope' })
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.csService.delete(id);
  }
}
