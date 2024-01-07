// custom-exception.ts
import { HttpStatus, HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(status: HttpStatus, message: string) {
    super(message, status);
  }

  static error(
    message: string = 'Internal Server Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): CustomException {
    return new CustomException(status, message);
  }
}
