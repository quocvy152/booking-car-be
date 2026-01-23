import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '../../user/domain/enums';
import { AuthProvider } from '../../auth/domain/enums';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  full_name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84123456789',
    required: false,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Authentication provider',
    enum: AuthProvider,
    example: AuthProvider.EMAIL,
  })
  provider: AuthProvider;

  @ApiProperty({
    description: 'Provider ID (for social auth)',
    example: null,
    required: false,
    nullable: true,
  })
  provider_id: string | null;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  gender: Gender;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  date_of_birth: Date | null;

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123456',
    required: false,
    nullable: true,
  })
  referral_code: string | null;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Soft delete flag',
    example: false,
  })
  is_deleted: boolean;
}
