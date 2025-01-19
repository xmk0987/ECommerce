import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/products.models';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

// Stub for PrimaryButtonComponent to simulate button clicks.
@Component({
  selector: 'app-primary-button',
  template: `<button (click)="btnClicked.emit()">{{ label }}</button>`,
})
class PrimaryButtonStubComponent {
  @Input() label!: string;
  @Input() routerLink?: string | any[];
  @Output() btnClicked = new EventEmitter<void>();
}

// Fake CartService for testing purposes.
class FakeCartService {
  private _cart: any[] = [];

  // Simulates a signal by returning the private _cart array.
  cart() {
    return this._cart;
  }

  // Allow tests to control the cart state.
  setCart(items: any[]) {
    this._cart = items;
  }

  increaseQuantity = jasmine.createSpy('increaseQuantity');
  decreaseQuantity = jasmine.createSpy('decreaseQuantity');
  getTotalCartItems = jasmine
    .createSpy('getTotalCartItems')
    .and.callFake(() =>
      this._cart.reduce((total, item) => total + item.quantity, 0)
    );
  calculateTotal = jasmine.createSpy('calculateTotal').and.callFake(() => {
    const total = this._cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return parseFloat(total.toFixed(2));
  });
  goToCheckout = jasmine.createSpy('goToCheckout');
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let fakeCartService: FakeCartService;

  // Sample product for testing.
  const sampleProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test product description',
    category: 'music',
    price: 100,
    image: 'test-image.jpg',
  };

  beforeEach(async () => {
    fakeCartService = new FakeCartService();

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: fakeCartService },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
    })
      .overrideComponent(CartComponent, {
        set: {
          imports: [NgFor, NgIf, RouterLink, PrimaryButtonStubComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the CartComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Cart is Empty" when cart is empty', () => {
    fakeCartService.setCart([]);
    fixture.detectChanges();

    const emptyCartEl = fixture.debugElement.query(By.css('.emptyCart'));
    expect(emptyCartEl).toBeTruthy();
    expect(emptyCartEl.nativeElement.textContent).toContain('Cart is Empty');

    // Verify that the stub primary button for "Go to shop" is rendered.
    const primaryButtonEl = emptyCartEl.query(
      By.directive(PrimaryButtonStubComponent)
    );
    expect(primaryButtonEl).toBeTruthy();
    const buttonInstance =
      primaryButtonEl.componentInstance as PrimaryButtonStubComponent;
    expect(buttonInstance.label).toBe('Go to shop');
  });

  it('should display cart items and checkout when there are items in the cart', () => {
    fakeCartService.setCart([{ ...sampleProduct, quantity: 2 }]);
    fakeCartService.getTotalCartItems.and.returnValue(2);
    fakeCartService.calculateTotal.and.returnValue(200.0);
    fixture.detectChanges();

    const cartListEl = fixture.debugElement.query(By.css('.cart-list'));
    expect(cartListEl).toBeTruthy();

    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(1);

    const titleEl = cartItems[0].query(By.css('.cart-item-info p'));
    expect(titleEl.nativeElement.textContent).toContain('Test Product');

    const checkoutInfoEls = fixture.debugElement.queryAll(
      By.css('.checkout-info')
    );
    expect(checkoutInfoEls.length).toBeGreaterThanOrEqual(2);
    expect(checkoutInfoEls[0].nativeElement.textContent).toContain('Items:');
    expect(checkoutInfoEls[1].nativeElement.textContent).toContain('Total:');
  });

  it('should call increaseQuantity when the "+" button is clicked', () => {
    fakeCartService.setCart([{ ...sampleProduct, quantity: 1 }]);
    fixture.detectChanges();

    // Find all buttons within quantity-controls.
    const incButtons = fixture.debugElement.queryAll(
      By.css('.quantity-controls button')
    );
    // Assume that the second button is the "+" button.
    const plusButtonEl = incButtons[1].nativeElement;
    plusButtonEl.click();

    expect(fakeCartService.increaseQuantity).toHaveBeenCalledWith(
      sampleProduct.id
    );
  });

  it('should call decreaseQuantity when the "-" button is clicked', () => {
    fakeCartService.setCart([{ ...sampleProduct, quantity: 1 }]);
    fixture.detectChanges();

    const decButtons = fixture.debugElement.queryAll(
      By.css('.quantity-controls button')
    );
    // Assume that the first button is the "-" button.
    const minusButtonEl = decButtons[0].nativeElement;
    minusButtonEl.click();

    expect(fakeCartService.decreaseQuantity).toHaveBeenCalledWith(
      sampleProduct.id
    );
  });

  it('should call goToCheckout when "Go to Checkout" button is clicked', () => {
    fakeCartService.setCart([{ ...sampleProduct, quantity: 1 }]);
    fixture.detectChanges();

    // Find the primary button with label "Go to Checkout"
    const checkoutButtonDebugEl = fixture.debugElement
      .queryAll(By.directive(PrimaryButtonStubComponent))
      .find((de) => {
        const instance = de.componentInstance as PrimaryButtonStubComponent;
        return instance.label === 'Go to Checkout';
      });
    expect(checkoutButtonDebugEl).toBeTruthy();
    checkoutButtonDebugEl!.triggerEventHandler('btnClicked', null);

    expect(fakeCartService.goToCheckout).toHaveBeenCalled();
  });

  it('should have trackById return the item id', () => {
    const id = component.trackById(0, sampleProduct);
    expect(id).toBe(sampleProduct.id);
  });
});
