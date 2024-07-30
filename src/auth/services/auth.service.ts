import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { AuthDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private database: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(auth: AuthDto) {
    const user = await this.database.findById(auth.id).exec();

    if (!user || user.deletedAt !== null) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    if (!bcrypt.compareSync(auth.password, user.password)) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    const { name, email } = user;

    return { name, email, token: this.getJwtToken({ name, email }) };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
