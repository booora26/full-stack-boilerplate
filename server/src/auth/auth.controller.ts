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
import { UsersService } from '../users/users.service';
import { TwoFAGuard } from './guard/twoFA.guard';
import { en } from '@faker-js/faker';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req) {
    console.log('8 - local login controler');
    if (req.user.isTwoFactorAuthenticationEnabled) {
      return true;
    }
    if (!req.user) {
      throw new Error('Authentication error');
    }

    return true;
  }

  @Public()
  @Post('register')
  async register(@Body() entity: any) {
    try {
      return this.authService.register(entity);
    } catch {
      throw new Error('user exists');
    }
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
    if (!req.user) {
      throw new Error(' No authenticated user');
    }

    const { twoFactorAuthenticationSecret, isTwoFactorAuthenticated, ...user } =
      req.user;
    return user;
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
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Res() response,
    @Body('twoFactorAuthenticationCode') twoFactorAuthenticationCode,
  ) {
    const user = await this.usersService.findOne(request.user.id);
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const updatedUser = await this.usersService.turnOnTwoFactorAuthentication(
      request.user.id,
    );

    if (updatedUser.affected > 0)
      return this.authService.logOut(request, response);
  }

  @UseGuards(TwoFAGuard)
  @Public()
  @Post('2fa/authenticate')
  @HttpCode(200)
  async authenticate2FA(@Req() request) {
    // const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
    //   twoFactorAuthenticationCode,
    //   request.user,
    // );
    // if (!isCodeValid) {
    //   throw new UnauthorizedException('Wrong authentication code');
    // }

    // request.user.is2FA = true;

    return request.user;
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req,
    // @Res() res,
    @Body('password') password: string,
    @Body('newPassword1') newPassword1: string,
    @Body('newPassword2') newPassword2: string,
  ) {
    try {
      const updatedUser = await this.authService.resetPassword(
        password,
        newPassword1,
        newPassword2,
        req,
        // res,
      );
      return updatedUser;
    } catch (err) {
      throw new Error(err);
    }
  }
}
