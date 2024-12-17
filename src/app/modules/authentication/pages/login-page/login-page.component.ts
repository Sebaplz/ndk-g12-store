import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {Ripple} from 'primeng/ripple';
import {Store} from '@ngrx/store';
import {AuthStore} from '../../../../resources/stores';
import {authReaction} from '../../../../library/reactions';
import {NgIf} from '@angular/common';
import {LoginRequest} from '../../../../resources/io/auth/login.in';
import {authAction} from '../../../../global/actions/auth.action';
import {RouterLink} from '@angular/router';

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
    NgIf,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, OnDestroy{

  private readonly formBuilder = inject(FormBuilder);
  authStore = inject(Store<{ auth: AuthStore }>);

  errorMessage: string | null = null;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    this.authStore.select(state => state.auth).subscribe(auth => {
      if (auth.error) {
        this.errorMessage = auth.error;
      }
    });
  }

  ngOnDestroy(): void {
    this.authStore.dispatch(authAction.clearError());
  }

  onSubmit(): void {
    const {email, password} = this.loginForm.value as LoginRequest;
    this.authStore.dispatch(authReaction.login({email, password}));
  }

}
