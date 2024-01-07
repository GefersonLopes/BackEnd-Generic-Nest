import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../Exception';

export function AlreadyExists(findValue: any, message?: string) {
  if (findValue) {
    throw new CustomException(
      HttpStatus.BAD_REQUEST,
      message || 'Already exists',
    );
  }
}

export function NotFound(findValue: any, message?: string) {
  if (!findValue) {
    throw new CustomException(HttpStatus.NOT_FOUND, message || 'Not found');
  }
}

export function BadRequest(message?: string) {
  throw new CustomException(HttpStatus.BAD_REQUEST, message || 'Bad request');
}

export function BodyNull(body: any[]) {
  body.forEach((value) => {
    if (!value) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Missing required fields',
      );
    }
  });
}

export function NotAuthorized() {
  throw new CustomException(HttpStatus.UNAUTHORIZED, 'Not authorized');
}

export function InvalidToken() {
  throw new CustomException(HttpStatus.UNAUTHORIZED, 'Invalid token');
}
