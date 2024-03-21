import { HttpException, HttpStatus } from '@nestjs/common';

export class JwtError extends HttpException {
  constructor(message: string, status: HttpStatus, data: any) {
    super({ message, data }, status);
  }
}
