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
import { EmailService } from '../services/email.service';
import {
  CreateCustomerEmailDto,
  UpdateCustomerEmailDto,
  SendNewsletterEmailDto,
  SendBulkEmailDto,
  SendEmailDto,
} from '../dtos/email.dto';

import { MongoIdPipe } from '../../common/mongo-id.pipe';

@ApiTags('Email Service')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('bulk')
  @ApiOperation({ summary: 'Send a bulk emails' })
  bulkSend(@Body() email: SendBulkEmailDto) {
    return this.emailService.bulkSend(email);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a email' })
  send(@Body() email: SendEmailDto) {
    return this.emailService.send(email);
  }

  @Post('send-newsletter')
  @ApiOperation({ summary: 'Send the newsletter to customers' })
  sendNewsletter(@Body() email: SendNewsletterEmailDto) {
    return this.emailService.sendNewsletter(email);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sets of customer emails' })
  get() {
    return this.emailService.get();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one set of customer emails' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.emailService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create one set of customer emails' })
  create(@Body() set: CreateCustomerEmailDto) {
    return this.emailService.create(set);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update one set of customer emails' })
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() set: UpdateCustomerEmailDto,
  ) {
    return this.emailService.update(id, set);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one set of customer emails' })
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.emailService.delete(id);
  }
}
