import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Session,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decotators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    console.log('8 - login controler');
  }

  @Get('logout')
  async logout(@Request() req, @Response() res) {
    return this.authService.logOut(req, res);
  }

  @Get()
  async authenticate(@Req() req) {
    return req.user;
  }
}
