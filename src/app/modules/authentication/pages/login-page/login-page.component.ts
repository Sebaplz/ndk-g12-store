import {Component, inject} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {Ripple} from 'primeng/ripple';

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
    Ripple
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  private readonly formBuilder = inject(FormBuilder);
  // private readonly authService = inject(AuthService);
  // private readonly router = inject(Router);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  onSubmit(): void {
    // const credentials = this.loginForm.value;
    // this.authService.login(credentials).subscribe({
    //   next: () => {
    //     this.router.navigate(['/']);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    //   },
    // });
  }

}
