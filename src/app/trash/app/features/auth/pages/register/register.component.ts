import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {DividerModule} from 'primeng/divider';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MessagesModule} from 'primeng/messages';
import {FloatLabelModule} from 'primeng/floatlabel';
import {MessageModule} from 'primeng/message';
import {AuthService} from '../../../../core/services/auth.service';
import {UserCredentials} from '../../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, DividerModule, ButtonModule, InputTextModule,
    ReactiveFormsModule, RouterLink, MessagesModule, FloatLabelModule,
    FormsModule, MessageModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string = '';

  /** Register form group */
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmPassword: ['', [Validators.required]]
  });

  /**
   * Returns error message for a specific field
   * @param field Field name
   * @returns Error message string
   */
  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

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

    if (field === 'confirmPassword' && control?.value !== this.registerForm.get('password')?.value) {
      return `Passwords do not match.`;
    }

    return '';
  }

  onSubmit(): void {
    const { email, password } = this.registerForm.value as UserCredentials;
    const credentials: UserCredentials = { email, password };

    this.authService.register(credentials).subscribe({
      next: (response) => {
        this.authService.login(credentials).subscribe({
          next: (loginResponse) => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.errorMessage = err;
          },
        });
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

}
