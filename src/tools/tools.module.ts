import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { IntelxController } from './api/controllers/intelx.controller';
import { IntelxService } from './api/services/intelx.service';

import { FileModule } from '@/file/file.module';
import { EmailModule } from '@/email/email.module';

import config from '../config';

@Module({
  imports: [HttpModule, EmailModule, FileModule],
  controllers: [IntelxController],
  providers: [
    IntelxService,
    {
      provide: 'configService',
      useFactory: async (configService: ConfigType<typeof config>) => {
        return configService.api;
      },
      inject: [config.KEY],
    },
  ],
  exports: [IntelxService],
})
export class ToolsModule {}
