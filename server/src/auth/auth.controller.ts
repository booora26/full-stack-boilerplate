import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Req,
  Body,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decotators/public.decorator';
import { GoogleGuard } from './guard/google.guard';
import { GitHubGuard } from './guard/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    console.log('8 - local login controler');
  }
  @Public()
  @Post('register')
  async register(@Body() entity: any) {
    return this.authService.register(entity);
  }

  @Get('logout')
  async logout(@Request() req, @Response() res) {
    const originalUser = req.session.originalUser;
    const currentUser = req.session.passport.user;

    if (originalUser && currentUser.email !== originalUser.email) {
      return this.authService.logOutImpersonateUser(req, res);
    }
    return this.authService.logOut(req, res);
  }

  @Get()
  async authenticate(@Req() req) {
    return { currentUser: req.user, originalUser: req.session.originalUser };
  }

  @UseGuards(GoogleGuard)
  @Public()
  @Get('google')
  async googleAuth(@Request() req) {
    console.log('8 - google login controler');
  }

  @UseGuards(GoogleGuard)
  @Public()
  @Get('google/callback')
  async googleAuthRedirect(@Request() req, @Response() res) {
    return this.authService.otherLogIn(req, res);
  }
  @UseGuards(GitHubGuard)
  @Public()
  @Get('github')
  async githubAuth(@Request() req) {
    console.log('8 - github login controler');
  }

  @UseGuards(GitHubGuard)
  @Public()
  @Get('github/callback')
  async githubAuthRedirect(@Request() req, @Response() res) {
    return this.authService.otherLogIn(req, res);
  }
}
