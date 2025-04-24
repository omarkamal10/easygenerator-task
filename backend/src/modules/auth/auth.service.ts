import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    this.logger.log(
      `Attempting to create user with email: ${createUserDto.email}`,
    );
    const user = await this.userService.create(createUserDto);

    const token = this.generateToken(user._id.toString());

    this.logger.log(`User created successfully: ${user.email}`);
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async signIn(loginUserDto: LoginUserDto) {
    this.logger.log(`Login attempt for user: ${loginUserDto.email}`);
    const { email, password } = loginUserDto;

    try {
      const user = await this.userService.findByEmail(email);
      const isPasswordValid = await this.validatePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user._id.toString());

      this.logger.log(`User logged in successfully: ${email}`);
      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      this.logger.error(`Login failed for user: ${email}`, error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateUser(payload: JwtPayload) {
    const { sub } = payload;
    const user = await this.userService.findById(sub);
    return user;
  }

  private async validatePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }

  private generateToken(userId: string): string {
    const payload: JwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
