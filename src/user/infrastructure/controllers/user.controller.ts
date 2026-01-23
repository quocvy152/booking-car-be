import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from '../dto';
import { Role } from '../../domain/enums';
import { AuthProvider } from '../../../auth/domain/enums';
import {
  ApiStandardController,
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '../../../common/swagger';
import { UserResponseDto, MessageResponseDto } from '../../../common/dto';

@ApiStandardController('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiStandardResponse(
    HttpStatus.CREATED,
    'User successfully created',
    UserResponseDto,
  )
  @ApiStandardErrorResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create({
      full_name: createUserDto.full_name,
      email: createUserDto.email,
      password: createUserDto.password,
      phone: createUserDto.phone ?? null,
      provider: AuthProvider.EMAIL,
      provider_id: null,
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
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiStandardResponse(200, 'User found', UserResponseDto)
  @ApiStandardResponse(200, 'User not found', MessageResponseDto)
  @ApiStandardErrorResponse()
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @ApiStandardResponse(200, 'User found', UserResponseDto)
  @ApiStandardResponse(200, 'User not found', MessageResponseDto)
  @ApiStandardErrorResponse()
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }
}
