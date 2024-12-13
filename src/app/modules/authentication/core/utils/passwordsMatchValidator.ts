import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    // Si las contraseñas no coinciden, retorna un error
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  };
}
