import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { FormControl } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

  public searchInput = new FormControl('');

  public products: Product[] = []

  public selectedProduct?: Product;

  constructor( private productsService: ProductsService ) {}

  searchProduct() {

    const value: string = this.searchInput.value || '';

    this.productsService.getSuggestions( value )
      .subscribe( products => this.products = products );

  }

  onSelectedOption( event: MatAutocompleteSelectedEvent ): void {
    if( !event.option.value ) {
      this.selectedProduct = undefined;
      return;
    }

    const product: Product = event.option.value;

    this.searchInput.setValue( product.title );

    this.selectedProduct = product;
  }



}
