import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  CreateCustomerScopeDto,
  UpdateCustomerScopeDto,
} from '../dtos/customers-scope.dto';
import { CustomerScope } from '../entities/customers-scope.entity';

import { handleException } from '@/common/handle-exception';
import { notFoundDocument } from '@/common/not-found-document';
import { isNotEmptyDocument } from '@/common/is-not-empty-document';

const filter: FilterQuery<CustomerScope> = {};
filter.deletedAt = { $eq: null };

@Injectable()
export class CustomersScopeService {
  constructor(
    @InjectModel(CustomerScope.name) private database: Model<CustomerScope>,
  ) {}

  async get() {
    const data = await this.database.find(filter).exec();
    if (data.length === 0) {
      throw new NotFoundException(
        `There are no customers scopes in the database`,
      );
    }
    return data;
  }

  async getOne(id: string) {
    const document = await this.database.findById(id).exec();
    notFoundDocument(document, id, 'Customer scope');
    return document;
  }

  async create(scope: CreateCustomerScopeDto) {
    try {
      const data = await new this.database(scope).save();
      return {
        message: `The customer scope was created`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  async update(id: string, scope: UpdateCustomerScopeDto) {
    isNotEmptyDocument(scope);
    await this.getOne(id);

    try {
      const data = await this.database
        .findByIdAndUpdate(id, { $set: scope }, { new: true })
        .exec();
      return {
        message: `The customer scope was updated`,
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
        message: `The customer scope was deleted`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }
}
