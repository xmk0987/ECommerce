import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';
import { Product } from '../../models/products.models';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [NgFor, PrimaryButtonComponent, NgIf, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);

  /**
   * Track items by their unique ID to optimize rendering performance.
   * @param index - The index of the item in the array.
   * @param item - The current cart item.
   * @returns The unique identifier of the cart item.
   */
  trackById(index: number, item: Product): number {
    return item.id;
  }
}
