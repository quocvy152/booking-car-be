import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from '../dto';
import { Role } from '../../domain/enums';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create({
      email: createUserDto.email,
      phone: createUserDto.phone ?? null,
      gender: createUserDto.gender,
      role: createUserDto.role ?? Role.USER,
      avatar: createUserDto.avatar ?? null,
      date_of_birth: createUserDto.date_of_birth
        ? new Date(createUserDto.date_of_birth)
        : null,
      referral_code: createUserDto.referral_code ?? null,
    });

    return user;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }
}
