import { Component, input } from '@angular/core';
import { Product } from '../../../models/products.models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [NgIf],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<Product>();
}
