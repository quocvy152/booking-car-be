import {
  IsEmail,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface RegisterDtoObject {
  password: string;
  [key: string]: unknown;
}

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    const object = args.object as RegisterDtoObject;
    const relatedValue = object[relatedPropertyName];
    return confirmPassword === relatedValue;
  }

  defaultMessage() {
    return 'confirm_password must match password';
  }
}

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84123456789',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'password123',
  })
  @IsString()
  @Validate(MatchPasswordConstraint, ['password'])
  confirm_password: string;
}
