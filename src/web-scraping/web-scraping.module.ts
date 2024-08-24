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

import { FileGeneratorModule } from '@/file-generator/file-generator.module';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    EmailModule,
    FileGeneratorModule,
    MongooseModule.forFeature([
      { name: WSVulnerabilities.name, schema: WSVulnerabilitiesSchema },
    ]),
  ],
  controllers: [WSVulnerabilitiesController, WebScrapingController],
  providers: [WSVulnerabilitiesService, WebScrapingService],
})
export class WebScrapingModule {}
