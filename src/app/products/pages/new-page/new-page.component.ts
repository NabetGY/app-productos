import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Category, Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public productForm = new FormGroup({
    id:          new FormControl<number>(0),
    title:       new FormControl<string>('', { nonNullable: true }),
    price:       new FormControl<number>(0),
    description: new FormControl<string>(''),
    images:      new FormControl<string>(''),
    creationAt:  new FormControl<string>(''),
    updatedAt:   new FormControl<string>(''),
    category:    new FormControl<Category>(Category.Clothes),
    maker:   new FormControl<string>(''),
  });

  public categorias: string[] = [
    "Clothes",
    "Electronics",
    "Furniture",
    "Miscellaneous",
    "Shoes",
  ]

  constructor(
    private productService: ProductsService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}



  get currentProduct(): Product {

    let product: Product = this.productForm.value as Product;

    return product;
  }


  onSubmit(): void {

    if( this.productForm.invalid ) return;

    if( this.currentProduct.id ){
      this.productService.updateProduct( this.currentProduct )
        .subscribe( product => {
          this.showSnackBar(`${ product.title } actualizado!`);
        });

      return;
    }

    this.productService.addProduct( this.currentProduct )
      .subscribe( product => {
        this.router.navigate(['/products/edit', product.id ])
        this.showSnackBar(`${ product.title } creado!`);
      });
  }

  isEditing(): boolean {
    return this.router.url.includes('edit')
  }


  ngOnInit(): void {

    if ( !this.isEditing() ) return;

    this.activateRoute.params
      .pipe(
        switchMap( ({id}) => this.productService.getProductById( id )),
      )
      .subscribe( product => {

        if ( product === undefined) {
          return this.router.navigateByUrl('/');
        }

        this.productForm.reset( product );

        return;

      });
  }

  onDeleteProduct(): void {

    if ( !this.currentProduct.id ) throw Error('Product id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.productForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result === true),
        switchMap( () => this.productService.deleteProduct( this.currentProduct.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),

      )
    .subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  showSnackBar( message: string ): void {
    this.snackBar.open( message, 'done', {
      duration: 2500,
    })
  }

}
