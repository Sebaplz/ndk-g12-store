import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {MessagesModule} from 'primeng/messages';
import {FloatLabelModule} from 'primeng/floatlabel';
import {MessageModule} from 'primeng/message';
import {AuthService} from '../../../../core/services/auth.service';
import {UserCredentials} from '../../../../core/interfaces/auth.interface';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthState} from '../../../../store/auth/auth.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DividerModule, ButtonModule, InputTextModule, ReactiveFormsModule, RouterLink, MessagesModule, FloatLabelModule, FormsModule, MessageModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string = '';
  error$: Observable<string | null>;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.error$ = this.store.select(state => state.auth.error);
  }

  /** Login form group */
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  /**
   * Returns error message for a specific field
   * @param field Field name
   * @returns Error message string
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);

    if (control?.hasError('required')) {
      return `${field} is required.`;
    }

    if (field === 'email' && control?.hasError('email')) {
      return `Invalid email format.`;
    }

    if (field === 'password' && control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `Password must be at least ${requiredLength} characters long.`;
    }

    if (field === 'password' && control?.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return `Password must be at most ${requiredLength} characters long.`;
    }

    return '';
  }

  /** Handles the login form submission */
  onSubmit(): void {
    const credentials = this.loginForm.value as UserCredentials;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      },
    });
  }
}
