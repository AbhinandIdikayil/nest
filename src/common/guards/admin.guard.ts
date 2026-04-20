import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Environments } from '../environments/environments.service';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Assuming "Bearer <token
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const expectedKey = Environments.get('ADMIN_KEY');
    if (token?.trim() !== expectedKey?.trim()) {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}
