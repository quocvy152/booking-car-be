import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth as SwaggerApiBearerAuth } from '@nestjs/swagger';

/**
 * Decorator to add Bearer JWT authentication to Swagger documentation
 * Use this on protected endpoints that require JWT authentication
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @ApiStandardBearerAuth()
 * @UseGuards(JwtAuthGuard)
 * async getProfile() { ... }
 * ```
 */
export const ApiStandardBearerAuth = () => {
  return applyDecorators(SwaggerApiBearerAuth('JWT-auth'));
};
