import { Component, signal } from '@angular/core';
import { Product } from '../../models/products.models';
import { ProductCardComponent } from "./product-card/product-card.component";

@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  products = signal<Product[]>([
    {
      id: 1,
      title: 'Wireless Headphones',
      image: 'https://via.placeholder.com/150?text=Headphones',
      price: 99.99,
      stock: 25,
    },
    {
      id: 2,
      title: 'Smartwatch',
      image: 'https://via.placeholder.com/150?text=Smartwatch',
      price: 149.99,
      stock: 10,
    },
    {
      id: 3,
      title: 'Bluetooth Speaker',
      image: 'https://via.placeholder.com/150?text=Speaker',
      price: 79.99,
      stock: 0,
    },
    {
      id: 4,
      title: 'Gaming Mouse',
      image: 'https://via.placeholder.com/150?text=Gaming+Mouse',
      price: 49.99,
      // This product intentionally does not include stock to showcase optional field usage
    },
    {
      id: 5,
      title: '4K Monitor',
      image: 'https://via.placeholder.com/150?text=4K+Monitor',
      price: 299.99,
      stock: 5,
    },
  ]);
}
