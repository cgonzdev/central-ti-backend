import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersScopeController } from './controllers/customers-scope.controller';
import { CustomersScopeService } from './services/customers-scope.service';

import {
  CustomerScope,
  CustomerScopeSchema,
} from './entities/customers-scope.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerScope.name, schema: CustomerScopeSchema },
    ]),
  ],
  controllers: [CustomersScopeController],
  providers: [CustomersScopeService],
})
export class InfoModule {}
