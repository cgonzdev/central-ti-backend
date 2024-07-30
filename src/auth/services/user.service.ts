import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

import { handleException } from '@/common/handle-exception';
import { notFoundDocument } from '@/common/not-found-document';
import { isNotEmptyDocument } from '@/common/is-not-empty-document';

import * as bcrypt from 'bcrypt';

const filter: FilterQuery<User> = {};
filter.deletedAt = { $eq: null };

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private database: Model<User>) {}

  async get() {
    const data = await this.database.find(filter).exec();
    if (data.length === 0) {
      throw new NotFoundException(`There are no users in the database`);
    }
    return data;
  }

  async getOne(id: string) {
    const document = await this.database.findById(id).exec();
    notFoundDocument(document, id, 'User');
    return document;
  }

  async create(user: CreateUserDto) {
    try {
      user.password = bcrypt.hashSync(user.password, 10);

      const data = await new this.database(user).save();
      return {
        message: `The user was created`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  async update(id: string, user: UpdateUserDto) {
    isNotEmptyDocument(user);
    await this.getOne(id);

    try {
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
      }

      const data = await this.database
        .findByIdAndUpdate(id, { $set: user }, { new: true })
        .exec();
      return {
        message: `The user was updated`,
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
        message: `The user was deleted`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }
}
