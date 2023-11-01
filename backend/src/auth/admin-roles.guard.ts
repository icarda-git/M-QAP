import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class AdminRolesGuard implements CanActivate {
  dataSource: any;
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request  = context.switchToHttp().getRequest();
 

    const user: any =  request.user;

    // console.log(user)
    if(user.role == 'admin') {
        return true;
    }
    else {
        return false;
    }
  }
}