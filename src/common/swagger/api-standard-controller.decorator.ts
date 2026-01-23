import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ApiStandardController = (tag: string) => {
  return applyDecorators(ApiTags(tag));
};
