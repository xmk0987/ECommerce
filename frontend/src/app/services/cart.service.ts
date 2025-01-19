import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.models';
import { Product } from '../models/products.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Initialize the cart signal by loading saved data from sessionStorage (if available).
  cart = signal<CartItem[]>(this.loadCartFromSession());

  constructor() {}

  /**
   * Adds a product to the cart. If it already exists, increases its quantity.
   * @param product - The product to add.
   */
  addToCart(product: Product): void {
    const currentCart = this.cart();
    const existingItem = currentCart.find((item) => item.id === product.id);

    if (existingItem) {
      this.cart.set(
        currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new product with an initial quantity of 1.
      this.cart.set([...currentCart, { ...product, quantity: 1 }]);
    }
    this.persistCart();
  }

  /**
   * Increases the quantity of the item with the given id.
   * @param productId - The id of the product to update.
   */
  increaseQuantity(productId: number): void {
    this.cart.set(
      this.cart().map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    this.persistCart();
  }

  /**
   * Decreases the quantity of the item with the given id.
   * If quantity reaches less than 1, the item is removed from the cart.
   * @param productId - The id of the product to update.
   */
  decreaseQuantity(productId: number): void {
    this.cart.set(
      this.cart()
        .map((item) => {
          if (item.id === productId) {
            // Remove the item if quantity would drop below 1.
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return null;
            }
          }
          return item;
        })
        // Filter out any null values (removed items).
        .filter((item): item is CartItem => item !== null)
    );
    this.persistCart();
  }

  /**
   * Calculates the total number of items in the cart (summed by quantity).
   * @returns The total cart items count.
   */
  getTotalCartItems(): number {
    return this.cart().reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Persist the current state of the cart in sessionStorage.
   */
  private persistCart(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  /**
   * Loads the cart from sessionStorage.
   * @returns The saved cart or an empty array if none is found or parsing fails.
   */
  private loadCartFromSession(): CartItem[] {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (error) {
        console.error('Error parsing cart data from sessionStorage:', error);
        return [];
      }
    }
    return [];
  }
}
