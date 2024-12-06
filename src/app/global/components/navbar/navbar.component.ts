import {Component, inject} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {Button} from 'primeng/button';
import {TabMenuModule} from 'primeng/tabmenu';
import {AsyncPipe} from "@angular/common";
import {AuthStore} from '../../../resources/stores/auth.store';
import {Store} from '@ngrx/store';
import {authAction} from '../../actions/auth.action';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenuModule,
    Button,
    TabMenuModule,
    AsyncPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  authStore = inject(Store<{ auth: AuthStore }>);
  email$ = this.authStore.select(state => state.auth.email);
  isAdmin$ = this.authStore.select(state => state.auth.isAdmin);
  isLoggedIn$ = this.authStore.select(state => state.auth.isLoggedIn);

  logout() {
    this.authStore.dispatch(authAction.logout());
  }
}
