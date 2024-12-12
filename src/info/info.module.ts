import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersScopeController } from './controllers/customers-scope.controller';
import { CustomersScopeService } from './services/customers-scope.service';

import {
  CustomerScope,
  CustomerScopeSchema,
} from './entities/customers-scope.entity';

import { InfoUsersController } from './controllers/info-users.controller';
import { InfoUsersService } from './services/info-users.service';
import { InfoUsers, InfoUsersSchema } from './entities/info-users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerScope.name, schema: CustomerScopeSchema },
      { name: InfoUsers.name, schema: InfoUsersSchema },
    ]),
  ],
  controllers: [CustomersScopeController, InfoUsersController],
  providers: [CustomersScopeService, InfoUsersService],
})
export class InfoModule {}
