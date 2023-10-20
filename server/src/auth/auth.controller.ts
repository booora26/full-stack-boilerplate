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
  Res,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decotators/public.decorator';
import { GoogleGuard } from './guard/google.guard';
import { GitHubGuard } from './guard/github.guard';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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
    // const originalUser = req.session.originalUser;
    // const currentUser = req.session.passport.user;

    // if (originalUser && currentUser.email !== originalUser.email) {
    if (req.user.originalUser) {
      console.log('vraca originalnog usera', req.user.originalUser);
      return this.authService.logOutImpersonateUser(req, res);
    }
    console.log('ne vraca originalnog usera');
    return this.authService.logOut(req, res);
  }

  @Get()
  async authenticate(@Req() req) {
    return req.user;
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

  @UseGuards(AuthenticatedGuard)
  @Post('2fa/generate')
  async register2FA(@Res() response, @Req() request) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('2fa/turn-on')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Body() { twoFactorAuthenticationCode },
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async authenticate2FA(
    @Req() request,
    @Body() { twoFactorAuthenticationCode },
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    request.user.is2FA = true;

    return request.user;
  }
}
