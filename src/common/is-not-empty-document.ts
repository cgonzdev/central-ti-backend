import { BadRequestException } from '@nestjs/common';
import { isNotEmptyObject } from 'class-validator';

const isNotEmptyDocument = (value: object) => {
  if (!isNotEmptyObject(value)) {
    throw new BadRequestException(`The document you have sent is empty`);
  }
};

export { isNotEmptyDocument };
