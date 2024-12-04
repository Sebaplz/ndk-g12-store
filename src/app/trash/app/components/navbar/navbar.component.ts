import {Component, inject, OnInit} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {Button} from 'primeng/button';
import {AuthService} from '../../core/services/auth.service';
import {TabMenuModule} from 'primeng/tabmenu';
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

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
  private authService = inject(AuthService);
  email$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor() {
    this.email$ = this.authService.selectUserEmail();
    this.isAuthenticated$ = this.authService.selectIsAuthenticated();
    this.isAdmin$ = this.authService.selectIsAdmin();
  }


  logout() {
    this.authService.logout();
  }
}
