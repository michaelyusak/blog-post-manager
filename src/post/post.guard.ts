import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class PostGuard implements CanActivate {
  private jwtService = require('jsonwebtoken');

  private dotenv = require('dotenv');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.dotenv.config();

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(
        token,
        process.env.JWT_SECRET,
      );

      const userId = JSON.parse(payload.data).userId;

      request['userId'] = userId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const header: any = request.headers;
    const bearerToken: string = header['authorization'] ?? '';
    const [bearer, token] = bearerToken.split(' ');

    if (bearer !== 'Bearer') {
      return undefined;
    }

    return token;
  }
}
