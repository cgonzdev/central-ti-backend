import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private database: Model<User>) {}

  async login(auth: AuthDto) {
    const user = await this.database.findById(auth.id).exec();

    if (!user || user.deletedAt !== null) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    if (!bcrypt.compareSync(auth.password, user.password)) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    return user;
  }
}
