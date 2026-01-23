import {
  IsEmail,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
  @IsString()
  full_name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @Validate(MatchPasswordConstraint, ['password'])
  confirm_password: string;
}
