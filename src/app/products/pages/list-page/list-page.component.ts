import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public products: Product[] = [];

  constructor( private produtsService: ProductsService ) {}

  ngOnInit(): void {
    this.produtsService.getProducts()
      .subscribe( products => this.products = products );
  }

}
