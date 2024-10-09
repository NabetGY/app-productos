import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  public hide: boolean = true;

  public registerForm = new FormGroup({
    id: new FormControl<number>(0),
    username: new FormControl<string>(''),
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
    isAgree: new FormControl<boolean>(false),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,

  ) {}


  get currentProduct(): User {

    let user: User = this.registerForm.value as User;

    return user;
  }



  onSubmit(): void {

    if( this.registerForm.invalid ) return;

    this.authService.register( this.currentProduct )
      .subscribe( user => {
        this.router.navigate(['/auth/login'])
        this.showSnackBar(`${ user.username } registrado exitosamente!`);
      });

  }

  showSnackBar( message: string ): void {
    this.snackBar.open( message, 'done', {
      duration: 2500,
    })
  }

}
