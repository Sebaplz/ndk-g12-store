import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthStore} from '../../../../resources/stores';
import {authReaction} from '../../../../library/reactions';
import {RegisterRequest} from '../../../../resources/io/auth/register.in';
import {NgIf} from '@angular/common';
import {authAction} from '../../../../global/actions/auth.action';
import {passwordsMatchValidator} from '../../core/utils/passwordsMatchValidator';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [
    ButtonDirective,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    Ripple,
    RouterLink,
    NgIf
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  private readonly formBuilder = inject(FormBuilder);

  authStore = inject(Store<{ auth: AuthStore }>);

  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmPassword: ['', [Validators.required]]
  }, {validators: passwordsMatchValidator()});

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
    const {email, password} = this.registerForm.value as RegisterRequest;
    this.authStore.dispatch(authReaction.register({email, password}));
  }

}
