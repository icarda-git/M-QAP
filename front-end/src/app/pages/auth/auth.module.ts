import { NgModule } from '@angular/core';
import { PagePaseModule } from '../page-pase.module';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [PagePaseModule,AuthRoutingModule],
  providers:[AuthService]
})
export class AuthModule {}
