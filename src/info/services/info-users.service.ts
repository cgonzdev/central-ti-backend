import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  CreateInfoUsersDto,
  CreateManyInfoUsersDto,
  GetInfoUsersDto,
} from '../dtos/info-users.dto';
import { InfoUsers } from '../entities/info-users.entity';

import { handleException } from '@/common/handle-exception';

import * as bcrypt from 'bcrypt';

@Injectable()
export class InfoUsersService {
  constructor(
    @InjectModel(InfoUsers.name) private database: Model<InfoUsers>,
  ) {}

  async getOne(userInfo: GetInfoUsersDto) {
    const filter: FilterQuery<InfoUsers> = {
      user: { $eq: userInfo.user },
      deletedAt: { $eq: null },
    };

    const data = await this.database.find(filter).exec();

    if (data.length === 0) {
      throw new NotFoundException(`This user info does not exist`);
    }

    const matchedUsers = [];
    for (const user of data) {
      const isMatch = await bcrypt.compareSync(userInfo.pass, user.pass);
      if (isMatch) {
        matchedUsers.push(user);
      }
    }

    if (matchedUsers.length === 0) {
      return {
        message: `The user ${userInfo.user} exists, but its password is new`,
      };
    }

    const links = Array.from(new Set(matchedUsers.map((item) => item.link)));

    const info = {
      user: userInfo.user,
      pass: userInfo.pass,
      type: matchedUsers[0].type,
      links: links,
      linkAssociated: false,
    };

    if (userInfo.link) info.linkAssociated = links.includes(userInfo.link);

    return info;
  }

  async create(user: CreateInfoUsersDto) {
    try {
      user.pass = bcrypt.hashSync(user.pass, 10);

      const data = await new this.database(user).save();
      return {
        message: `The user info was created`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }

  async createMany(many: CreateManyInfoUsersDto) {
    try {
      for (const user of many.users) {
        user.pass = bcrypt.hashSync(user.pass, 10);
      }

      const data = await this.database.insertMany(many.users, {
        ordered: false,
      });

      return {
        message: `The users info was created`,
        data: data,
      };
    } catch (exception) {
      handleException(exception);
    }
  }
}
