import { Component, input } from '@angular/core';
import { Product } from '../../../models/products.models';
import { PrimaryButtonComponent } from '../../../components/primary-button/primary-button.component';

@Component({
  selector: 'app-product-card',
  imports: [PrimaryButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<Product>();
}
