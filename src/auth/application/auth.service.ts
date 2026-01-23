import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/application/user.service';
import { User } from '../../user/domain/entities';
import { AuthProvider } from '../domain/enums';
import { Gender, Role } from '../../user/domain/enums';
import { RegisterDto } from '../infrastructure/dto/register.dto';
import { LoginDto } from '../infrastructure/dto/login.dto';
import { JwtPayload } from '../infrastructure/strategies/jwt.strategy';

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.userService.create({
      full_name: registerDto.full_name,
      email: registerDto.email,
      phone: registerDto.phone,
      password: hashedPassword,
      provider: AuthProvider.EMAIL,
      provider_id: null,
      gender: Gender.OTHER, // Default, can be updated later
      role: Role.USER,
      avatar: null,
      date_of_birth: null,
      referral_code: null,
    });

    // Generate token
    const token = await this.generateToken(user);

    // Return user without password
    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    ) as Omit<User, 'password'>;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has password (not social auth user)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account was created with social authentication. Please use social login.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = await this.generateToken(user);

    // Return user without password
    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    ) as Omit<User, 'password'>;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  async handleSocialAuth(
    provider: AuthProvider,
    providerId: string,
    email: string,
    fullName: string,
    avatar: string | null,
  ): Promise<AuthResponse> {
    // Try to find existing user by provider
    let user = await this.userService.findByProvider(provider, providerId);

    if (!user) {
      // Check if user exists with this email but different provider
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        // Link social account to existing user
        // For now, we'll create a new user or throw error
        // In production, you might want to link accounts
        throw new ConflictException(
          'An account with this email already exists. Please login with your original method.',
        );
      }

      // Create new user from social auth
      user = await this.userService.create({
        full_name: fullName,
        email: email,
        phone: null,
        password: undefined, // No password for social auth
        provider: provider,
        provider_id: providerId,
        gender: Gender.OTHER, // Default, can be updated later
        role: Role.USER,
        avatar: avatar,
        date_of_birth: null,
        referral_code: null,
      });
    }

    // Generate token
    const token = await this.generateToken(user);

    // Return user without password
    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    ) as Omit<User, 'password'>;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
}
