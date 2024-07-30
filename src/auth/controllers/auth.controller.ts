import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  create(@Body() auth: AuthDto) {
    return this.authService.login(auth);
  }
}
