import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: LoginService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.authService.verifyToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      return false;
    }
  }
}
