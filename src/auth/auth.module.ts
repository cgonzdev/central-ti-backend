import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
