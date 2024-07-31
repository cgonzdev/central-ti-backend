import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ShodanModule } from './shodan/shodan.module';
import { EmailModule } from './email/email.module';
import { WebScrapingModule } from './web-scraping/web-scraping.module';
import { InfoModule } from './info/info.module';
import { AuthModule } from './auth/auth.module';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        MONGO_USER: Joi.string().required(),
        MONGO_PASS: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_PORT: Joi.number().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_CONNECTION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    ShodanModule,
    EmailModule,
    WebScrapingModule,
    InfoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
