import { NotFoundException } from '@nestjs/common';

const notFoundDocument = (document: any, id: string, message: string) => {
  if (!document || document.deletedAt !== null) {
    throw new NotFoundException(`${message} with ID ${id} does not exist`);
  }
};

export { notFoundDocument };
