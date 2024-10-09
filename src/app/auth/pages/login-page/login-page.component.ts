import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  public hide: boolean = true;

  public loginForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }


  onLogin(): void {

    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe(user => {

        if (!user.length || user[0].password !== this.loginForm.value.password) {
          this.showSnackBar('Correo o contraseña invalidas');
        } else {
          this.router.navigate(['/']);
        }
      })



  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration: 2500,
    })
  }
}
