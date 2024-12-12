import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {Ripple} from 'primeng/ripple';
import {Router, RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthStore} from '../../../../resources/stores';
import {authReaction} from '../../../../library/reactions';
import {filter} from 'rxjs';
import {NgIf} from '@angular/common';
import {AuthEffect} from '../../../../library/effects';
import {LoginRequest} from '../../../../resources/io/auth/login.in';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonDirective,
    Ripple,
    RouterLink,
    NgIf
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  authStore = inject(Store<{ auth: AuthStore }>);
  private readonly router = inject(Router);
  private readonly authEffect = inject(AuthEffect);

  errorMessage: string | null = null;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    this.authEffect.loginError$.subscribe((error) => {
      this.errorMessage = error;
    });
  }

  onSubmit(): void {
    const {email, password} = this.loginForm.value as LoginRequest;
    this.authStore.dispatch(authReaction.login({email, password}));
    this.authStore
      .select((state) => state.auth)
      .pipe(
        filter((auth) => auth.check && auth.token !== null)
      )
      .subscribe((auth) => {
        if (auth.isAdmin) {
          this.router.navigate(['/dashboard/admin']);
        } else {
          this.router.navigate(['/dashboard/user']);
        }
      });
  }

}
