import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WSVulnerabilitiesController } from './controllers/ws-vulnerabilities.controller';
import { WSVulnerabilitiesService } from './services/ws-vulnerabilities.service';
import {
  WSVulnerabilities,
  WSVulnerabilitiesSchema,
} from './entities/ws-vulnerabilities.entity';

import { WebScrapingController } from './controllers/web-scraping.controller';
import { WebScrapingService } from './services/web-scraping.service';

import { FileModule } from '@/file/file.module';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    EmailModule,
    FileModule,
    MongooseModule.forFeature([
      { name: WSVulnerabilities.name, schema: WSVulnerabilitiesSchema },
    ]),
  ],
  controllers: [WSVulnerabilitiesController, WebScrapingController],
  providers: [WSVulnerabilitiesService, WebScrapingService],
})
export class WebScrapingModule {}
