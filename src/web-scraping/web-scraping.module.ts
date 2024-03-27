import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WSVulnerabilitiesController } from './controllers/ws-vulnerabilities.controller';
import { WSVulnerabilitiesService } from './services/ws-vulnerabilities.service';
import {
  WSVulnerabilities,
  WSVulnerabilitiesSchema,
} from './entities/ws-vulnerabilities.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WSVulnerabilities.name, schema: WSVulnerabilitiesSchema },
    ]),
  ],
  controllers: [WSVulnerabilitiesController],
  providers: [WSVulnerabilitiesService],
})
export class WebScrapingModule {}
