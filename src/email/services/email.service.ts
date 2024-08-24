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
  SendNewsletterEmailDto,
  SendBulkEmailDto,
  SendEmailDto,
} from '../dtos/email.dto';
import { CustomerEmail } from '../entities/email.entity';

import * as nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

import { handleException } from '@/common/handle-exception';
import { notFoundDocument } from '@/common/not-found-document';
import { isNotEmptyDocument } from '@/common/is-not-empty-document';
import { mailStructure } from '@/common/mail-structure';

import { APP_INFO } from '@/common/common-data';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const filter: FilterQuery<CustomerEmail> = {};
filter.deletedAt = { $eq: null };

@Injectable()
export class EmailService {
  private transporter: any;

  constructor(
    @InjectModel(CustomerEmail.name) private database: Model<CustomerEmail>,
    @Inject('configService') private configService,
  ) {
    const { host, port, user, pass } = configService;
    const secure = Boolean(configService.secure); //* only accepts true or false
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
        attachments: [],
      };

      if (email.isHTML) mailStructure.html = email.body;
      else mailStructure.text = email.body;

      if (email.attachment)
        mailStructure.attachments.push({ path: email.attachment });

      const info = await this.transporter.sendMail(mailStructure);

      return {
        id: info.messageId,
        messaje: 'Email sent successfully',
        to: email.to,
      };
    } catch (exception) {
      throw new ConflictException(`A conflict has occurred: ${exception}`);
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

  async sendNewsletter(email: SendNewsletterEmailDto) {
    try {
      const images = 'src/assets/images';
      const mailStructure = {
        from: this.configService.user,
        to: email.to,
        subject: email.subject,
        html: undefined,
        attachments: [
          {
            filename: 'fingerprint.svg',
            path: `${images}/fingerprint.svg`,
            cid: 'fingerprint.svg',
          },
          {
            filename: 'newsletters_logo.svg',
            path: `${images}/newsletters_logo.svg`,
            cid: 'newsletters_logo.svg',
          },
          {
            filename: 'figures.svg',
            path: `${images}/figures.svg`,
            cid: 'figures.svg',
          },
        ],
      };

      const htmlContentRoute = 'src/email/views/newsletter.template.html';
      let html = await fs.readFileSync(htmlContentRoute, 'utf8');

      const template = Handlebars.compile(html);
      html = template({ n: APP_INFO.newsletter, newsletter: email.newsletter });

      mailStructure.html = html;

      const info = await this.transporter.sendMail(mailStructure);

      return {
        id: info.messageId,
        messaje: 'Newsletter sent successfully to ' + email.to,
      };
    } catch (exception) {
      throw new ConflictException(`A conflict has occurred: ${exception}`);
    }
  }

  convertEmailData(set: CreateCustomerEmailDto | UpdateCustomerEmailDto) {
    const obj = JSON.parse(JSON.stringify(set));
    obj.to = set.to?.map((item) => item.email).join('; ');
    obj.cc = set.cc?.map((item) => item.email).join('; ');
    return obj;
  }
}
