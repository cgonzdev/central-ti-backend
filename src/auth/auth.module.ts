import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from './entities/user.entity';

import config from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { jwtSecret, jwtExpires } = configService.security;
        return { secret: jwtSecret, signOptions: { expiresIn: jwtExpires } };
      },
      inject: [config.KEY],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
