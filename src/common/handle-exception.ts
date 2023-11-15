import {
  BadRequestException,
  HttpException,
  ConflictException,
} from '@nestjs/common';

const handleException = (exception) => {
  if (exception.status) {
    handleHttpException(exception);
    return;
  }

  if (exception.code) {
    handleMongoError(exception);
    return;
  }

  throw new ConflictException(`A conflict has occurred: ${exception}`);
};

const handleHttpException = (exception) => {
  // HTTP Errors
  const { message, error, statusCode } = exception.response;
  throw new HttpException({ message, error, statusCode }, exception.status);
};

const handleMongoError = (exception) => {
  // Duplication in MongoDB (code 11000)
  if (exception.code === 11000) {
    const field = JSON.stringify(exception.keyValue).replace(/[{}"\\]/g, '');
    throw new BadRequestException(
      `The element you are trying to create is already created for the field -> ${field}`,
    );
  }
};

export { handleException };
