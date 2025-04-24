import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    const user = req.user;
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }
}
