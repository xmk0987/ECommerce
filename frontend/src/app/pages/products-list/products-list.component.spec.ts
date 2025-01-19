import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
} from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { Component } from '@angular/core';
import { Product } from '../../models/products.models';
import { Input } from '@angular/core';

// Stub for ProductCardComponent to avoid testing its internals here.
@Component({
  selector: 'app-product-card',
  template: '<div class="stub-product-card">{{ product.title }}</div>',
})
class ProductCardStubComponent {
  @Input() product!: Product;
}

// A fake list of products for testing.
const fakeProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    description: '',
    category: 'cat1',
    price: 100,
    image: 'img1.jpg',
  },
  {
    id: 2,
    title: 'Product 2',
    description: '',
    category: 'cat2',
    price: 200,
    image: 'img2.jpg',
  },
];

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, ProductCardStubComponent],
      declarations: [],
    })
      .overrideComponent(ProductsListComponent, {
        set: {
          imports: [ProductCardStubComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create the ProductsListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products and update the products signal', fakeAsync(() => {
    const fakeResponse = {
      json: () => Promise.resolve(fakeProducts),
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(fakeResponse as Response)
    );

    component.ngOnInit();
    flushMicrotasks();

    expect(component.products().length).toBe(2);
    expect(component.products()[0].title).toBe('Product 1');
  }));

  it('should render a product card for each product in the signal', fakeAsync(() => {
    const fakeResponse = {
      json: () => Promise.resolve(fakeProducts),
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(fakeResponse as Response)
    );

    component.ngOnInit();
    flushMicrotasks();
    fixture.detectChanges();

    const productCardEls =
      fixture.nativeElement.querySelectorAll('.stub-product-card');
    expect(productCardEls.length).toBe(fakeProducts.length);
    expect(productCardEls[0].textContent).toContain('Product 1');
  }));
});
