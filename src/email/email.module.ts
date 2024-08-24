import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';

import { CustomerEmail, CustomerEmailSchema } from './entities/email.entity';

import config from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerEmail.name, schema: CustomerEmailSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'configService',
      useFactory: async (configService: ConfigType<typeof config>) => {
        return configService.mail;
      },
      inject: [config.KEY],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
