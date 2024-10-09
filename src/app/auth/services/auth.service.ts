import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from '../../../enviroments/enviroments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = enviroments.baseUrl;

  private user?: User;

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  get currentUser(): User|undefined {

    if ( !this.user ) return undefined;

    return structuredClone( this.user );
  }


  login( email: string, passsword: string ): Observable<User[]> {
    return this.httpClient.get<User[]>(`${ this.baseUrl }/users/?email=${email}`)
          .pipe(
            tap( userList => {
              if (userList.length === 0){
                this.showSnackBar('Correo o contraseña invalidas');
                throw new Error('Usuario no encontrado');
              } else {
                this.user = userList[0]
              }

            } ),
            tap( userList => localStorage.setItem('token', userList[0].id.toString() ),
            )
          );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.httpClient.get<User>(`${ this.baseUrl }/users/${token}`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( err => of(false) )
      );
  }


  register( user: User): Observable<User> {

    return this.httpClient.post<User>(`${ this.baseUrl }/users`, user)

  }


  showSnackBar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration: 2500,
    })
  }

}
