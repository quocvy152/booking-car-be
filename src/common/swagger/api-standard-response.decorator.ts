import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export const ApiStandardResponse = <TModel extends Type<any>>(
  statusCode: number,
  description: string,
  type?: TModel,
  options?: Omit<ApiResponseOptions, 'status' | 'description' | 'type'>,
) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description,
      type,
      ...options,
    }),
  );
};
