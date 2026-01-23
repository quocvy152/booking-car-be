import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from '../../application/auth.service';
import { RegisterDto, LoginDto } from '../dto';
import { AuthProvider } from '../../domain/enums';
import {
  ApiStandardController,
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '../../../common/swagger';
import { AuthResponseDto } from '../../../common/dto';

interface OAuthUser {
  provider_id: string;
  email: string;
  full_name: string;
  avatar: string | null;
}

@ApiStandardController('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiStandardResponse(
    HttpStatus.CREATED,
    'User successfully registered',
    AuthResponseDto,
  )
  @ApiStandardErrorResponse()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiStandardResponse(
    HttpStatus.OK,
    'User successfully logged in',
    AuthResponseDto,
  )
  @ApiStandardErrorResponse()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth authentication' })
  @ApiExcludeEndpoint()
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback endpoint (redirects to frontend)',
  })
  @ApiExcludeEndpoint()
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as OAuthUser;
    const result = await this.authService.handleSocialAuth(
      AuthProvider.GOOGLE,
      user.provider_id,
      user.email,
      user.full_name,
      user.avatar,
    );

    // Redirect to frontend with token
    // You can customize this URL based on your frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Initiate Facebook OAuth authentication' })
  @ApiExcludeEndpoint()
  async facebookAuth() {
    // Initiates Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Facebook OAuth callback endpoint (redirects to frontend)',
  })
  @ApiExcludeEndpoint()
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as OAuthUser;
    const result = await this.authService.handleSocialAuth(
      AuthProvider.FACEBOOK,
      user.provider_id,
      user.email,
      user.full_name,
      user.avatar,
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
  }
}
