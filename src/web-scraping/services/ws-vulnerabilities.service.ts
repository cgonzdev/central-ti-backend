import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateWSVulnerabilitiesDto } from '../dtos/ws-vulnerabilities.dto';
import { WSVulnerabilities } from '../entities/ws-vulnerabilities.entity';

import { handleException } from '@/common/handle-exception';

const filter: FilterQuery<WSVulnerabilities> = {};
filter.deletedAt = { $eq: null };

@Injectable()
export class WSVulnerabilitiesService {
  constructor(
    @InjectModel(WSVulnerabilities.name)
    private database: Model<WSVulnerabilities>,
  ) {}

  async get() {
    const data = await this.database.find(filter).exec();
    if (data.length === 0) {
      throw new NotFoundException(
        `There are no ws vulnerabilities records in the database`,
      );
    }
    return data;
  }

  async getOne(id: string) {
    const data = await this.database.findById(id).exec();
    if (!data || data.deletedAt !== null) {
      throw new NotFoundException(
        `ws vulnerabilities records with id ${id} does not exist`,
      );
    }
    return data;
  }

  async getByTag(tag: string) {
    const data = await this.database
      .findOne({ tag: tag })
      .select('-_id -createdAt -updatedAt -__v -technologies._id')
      .exec();

    if (!data || data.deletedAt !== null) {
      throw new NotFoundException(`Record with customer => ${tag} not found`);
    }

    return JSON.parse(JSON.stringify(data));
  }

  async create(wsv: CreateWSVulnerabilitiesDto) {
    try {
      const data = await new this.database(wsv).save();
      return {
        message: 'ws vulnerabilities was created',
        data: data,
      };
    } catch (exception) {
      handleException(exception);
      throw new ConflictException(`A conflict has occurredo: ${exception}`);
    }
  }
}
