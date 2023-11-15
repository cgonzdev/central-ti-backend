import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  CreateCustomerEmailDto,
  UpdateCustomerEmailDto,
  SendBulkEmailDto,
  SendEmailDto,
} from '../dtos/email.dto';
import { CustomerEmail } from '../entities/email.entity';

import * as nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

import { handleException } from 'src/common/handle-exception';
import { notFoundDocument } from 'src/common/not-found-document';
import { isNotEmptyDocument } from 'src/common/is-not-empty-document';
import { mailStructure } from 'src/common/mail-structure';

const filter: FilterQuery<CustomerEmail> = {};
filter.deletedAt = { $eq: null };

@Injectable()
export class EmailService {
  private transporter: any;

  constructor(
    @InjectModel(CustomerEmail.name) private database: Model<CustomerEmail>,
    @Inject('configService') private configService,
  ) {
    const { host, port, user, pass, secure } = configService;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  async send(email: SendEmailDto) {
    try {
      const mailStructure = {
        from: this.configService.user,
        to: email.to,
        subject: email.subject,
        text: undefined,
        html: undefined,
      };

      if (email.isHTML) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(email.body, { waitUntil: 'domcontentloaded' });

        await new Promise((resolve) => setTimeout(resolve, 15000));

        const currentHtml = await page.content();
        await page.setViewport({ width: 1080, height: 1024 });

        const modifiedHtml = currentHtml.replace(
          /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g,
          (match, src) => {
            const currentSrc = new URL(src, page.url()).href;
            return match.replace(src, currentSrc);
          },
        );

        await browser.close();
        mailStructure.html = modifiedHtml;
      } else {
        mailStructure.text = email.body;
      }

      const info = await this.transporter.sendMail(mailStructure);

      return {
        id: info.messageId,
        messaje: 'Email sent successfully',
        to: email.to,
      };
    } catch (exception) {
      throw new ConflictException(`A conflict has occurredo: ${exception}`);
    }
  }

  async bulkSend(email: SendBulkEmailDto) {
    filter.category = { $eq: email.category };
    const data = await this.get();
    const output = 'The email was successfully sent to the following customers';
    const customers = [];

    for (const item of data) {
      const mail = mailStructure(
        this.configService.user,
        item.to,
        item.cc,
        email.subject,
        email.body,
      );

      await this.transporter.sendMail(mail);
      customers.push(item.customer);
    }
    delete filter.category;
    return output.concat(' ', customers.join(', '));
  }

  async get() {
    const data = await this.database.find(filter).exec();
    if (data.length === 0) {
      throw new NotFoundException(
        `There are no customer emails in the database`,
      );
    }
    return data;
  }

  async getOne(id: string) {
    const document = await this.database.findById(id).exec();
    notFoundDocument(document, id, 'Set of customer emails');
    return document;
  }

  async create(set: CreateCustomerEmailDto) {
    try {
      const data = await new this.database(this.convertEmailData(set)).save();
      return {
        message: `The set of emails for the customer ${data.customer} was created`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  async update(id: string, set: UpdateCustomerEmailDto) {
    isNotEmptyDocument(set);
    await this.getOne(id);

    try {
      const data = await this.database
        .findByIdAndUpdate(
          id,
          { $set: this.convertEmailData(set) },
          { new: true },
        )
        .exec();
      return {
        message: `The set of emails for the customer with ID ${id} was updated`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  async delete(id: string) {
    await this.getOne(id);
    try {
      const data = await this.database
        .findByIdAndUpdate(id, { $currentDate: { deletedAt: true } })
        .exec();
      return {
        message: `The set of emails for the customer with ID ${id} was deleted`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  convertEmailData(set: CreateCustomerEmailDto | UpdateCustomerEmailDto) {
    const obj = JSON.parse(JSON.stringify(set));
    obj.to = set.to?.map((item) => item.email).join('; ');
    obj.cc = set.cc?.map((item) => item.email).join('; ');
    return obj;
  }
}
