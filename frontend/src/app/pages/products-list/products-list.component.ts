// ProductsListComponent.ts
import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../models/products.models';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  // Initialize an empty signal for products; it will be updated after the fetch
  products = signal<Product[]>([]);

  /**
   * Fetch products from the API
   */
  ngOnInit(): void {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((json: Product[]) => {
        this.products.set(json);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }
}
