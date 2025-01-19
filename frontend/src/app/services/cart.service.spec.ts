// cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/products.models';
import { CartItem } from '../models/cart.models';

describe('CartService', () => {
  let service: CartService;

  // Sample product to use in the tests.
  const sampleProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test product description',
    category: 'music',
    price: 100,
    image: 'test-image.jpg',
  };

  const product2: Product = {
    id: 3,
    title: 'Test Product 2',
    description: 'Test product 2 description',
    category: 'sports',
    price: 50,
    image: 'test-image-2.jpg',
  };

  beforeEach(() => {
    // Clear sessionStorage before each test.
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);

    // Reset the cart signal for a clean state.
    service.cart.set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart from sessionStorage if available', () => {
    // Pre-populate sessionStorage with a cart item.
    const storedCart: CartItem[] = [{ ...sampleProduct, quantity: 2 }];
    sessionStorage.setItem('cart', JSON.stringify(storedCart));

    // Manually create a new instance to ensure it reads from sessionStorage.
    const newService = new CartService();
    expect(newService.cart().length).toBe(1);
    expect(newService.cart()[0].quantity).toBe(2);
  });

  it('should add a product to the cart', () => {
    spyOn(sessionStorage, 'setItem').and.callThrough();
    service.addToCart(sampleProduct);
    const currentCart = service.cart();

    expect(currentCart.length).toBe(1);
    expect(currentCart[0].quantity).toBe(1);
    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  it('should increase quantity if the product is added again', () => {
    spyOn(sessionStorage, 'setItem').and.callThrough();
    service.addToCart(sampleProduct);
    service.addToCart(sampleProduct);
    const currentCart = service.cart();

    expect(currentCart.length).toBe(1);
    expect(currentCart[0].quantity).toBe(2);
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('should increase the quantity of a product', () => {
    service.addToCart(sampleProduct);
    service.increaseQuantity(sampleProduct.id);
    const currentCart = service.cart();
    expect(currentCart[0].quantity).toBe(2);
  });

  it('should decrease the quantity of a product', () => {
    service.addToCart(sampleProduct);
    service.addToCart(sampleProduct); // quantity becomes 2
    service.decreaseQuantity(sampleProduct.id);
    const currentCart = service.cart();
    expect(currentCart[0].quantity).toBe(1);
  });

  it('should remove the product if quantity decreases below 1', () => {
    service.addToCart(sampleProduct); // quantity = 1
    service.decreaseQuantity(sampleProduct.id);
    const currentCart = service.cart();
    expect(currentCart.length).toBe(0);
  });

  it('should correctly calculate the total cart items', () => {
    // Add sampleProduct twice and product2 once.
    service.addToCart(sampleProduct); // quantity of sampleProduct becomes 1
    service.addToCart(sampleProduct); // quantity becomes 2
    service.addToCart(product2); // quantity of product2 becomes 1

    // getTotalCartItems() sums quantities: 2 + 1 = 3
    const totalItems = service.getTotalCartItems();
    expect(totalItems).toBe(3);
  });

  it('should correctly calculate the total cost formatted to 2 decimals', () => {
    // Add sampleProduct twice and product2 once.
    service.addToCart(sampleProduct); // 100
    service.addToCart(sampleProduct); // now sampleProduct quantity = 2 => 2 * 100 = 200
    service.addToCart(product2); // 1 * 50 = 50

    // Expected total = 200 + 50 = 250.00
    const totalCost = service.calculateTotal();
    expect(totalCost).toBe(250.0);
  });

});
