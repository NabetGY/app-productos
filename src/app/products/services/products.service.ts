import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { enviroments } from '../../../enviroments/enviroments';

@Injectable({providedIn: 'root'})
export class ProductsService {

  private baseUrl: string = enviroments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>( `${this.baseUrl}/products`);
  }

  getProductById( id: string ): Observable<Product | undefined> {
    return this.httpClient.get<Product>( `${this.baseUrl}/products/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  getSuggestions( query: string ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/products?q=${ query }&_limit=8`)
  }

  addProduct( product: Product ): Observable<Product> {
    return this.httpClient.post<Product>(`${this.baseUrl}/products`, product);
  }

  updateProduct( product: Product ): Observable<Product> {
    if ( !product.id ) {
      throw Error('Product is required');
    }
    return this.httpClient.patch<Product>(`${this.baseUrl}/products/${product.id}`, product);
  }

  deleteProduct( id: number ): Observable<boolean> {

    return this.httpClient.delete(`${this.baseUrl}/products/${id}`)
      .pipe(
        map( resp => true),
        catchError( err => of(false) ),
      );
  }
}
