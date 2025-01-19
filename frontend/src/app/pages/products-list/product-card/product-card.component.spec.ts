// product-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  InputSignal,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { Product } from '../../../models/products.models';
import { CartService } from '../../../services/cart.service';

/**
 * Stub for PrimaryButtonComponent to simulate button clicks.
 */
@Component({
  selector: 'app-primary-button',
  template: `<button (click)="btnClicked.emit()">{{ label }}</button>`,
})
class PrimaryButtonStubComponent {
  @Input() label!: string;
  @Input() routerLink?: string | any[];
  @Output() btnClicked = new EventEmitter<void>();
}

/**
 * Fake CartService for testing.
 */
class FakeCartService {
  addToCart = jasmine.createSpy('addToCart');
}

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let fakeCartService: FakeCartService;

  // Sample product for testing.
  const sampleProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test product description',
    category: 'music',
    price: 150,
    image: 'test-image.jpg',
  };

  beforeEach(async () => {
    fakeCartService = new FakeCartService();

    await TestBed.configureTestingModule({
      // Since ProductCardComponent is standalone, import it here.
      imports: [ProductCardComponent],
      providers: [{ provide: CartService, useValue: fakeCartService }],
    })
      // Override the component's imports so that our stub is used for PrimaryButtonComponent.
      .overrideComponent(ProductCardComponent, {
        set: {
          imports: [PrimaryButtonStubComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    // Cast the writable signal to the InputSignal<Product> type
    component.product = signal<Product>(
      sampleProduct
    ) as unknown as InputSignal<Product>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the product image with correct src and alt attributes', () => {
    const imgEl: HTMLImageElement = fixture.debugElement.query(
      By.css('.product-image')
    ).nativeElement;
    expect(imgEl.src).toContain(sampleProduct.image);
    expect(imgEl.alt).toBe(sampleProduct.title);
  });

  it('should display the product title', () => {
    const titleEl = fixture.debugElement.query(
      By.css('.product-title')
    ).nativeElement;
    expect(titleEl.textContent).toContain(sampleProduct.title);
  });

  it('should display the product price', () => {
    const priceEl = fixture.debugElement.query(
      By.css('.product-price')
    ).nativeElement;
    expect(priceEl.textContent).toContain(`$${sampleProduct.price}`);
  });

  it('should render the primary button with label "Add to Cart"', () => {
    const buttonDebugEl = fixture.debugElement.query(
      By.directive(PrimaryButtonStubComponent)
    );
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance =
      buttonDebugEl.componentInstance as PrimaryButtonStubComponent;
    expect(buttonInstance.label).toBe('Add to Cart');
  });

  it('should call cartService.addToCart with the product when "Add to Cart" button is clicked', () => {
    const buttonDebugEl = fixture.debugElement.query(
      By.directive(PrimaryButtonStubComponent)
    );
    buttonDebugEl.triggerEventHandler('btnClicked', null);
    expect(fakeCartService.addToCart).toHaveBeenCalledWith(sampleProduct);
  });
});
