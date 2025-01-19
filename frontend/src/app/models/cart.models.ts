import { Product } from './products.models';

export interface CartItem extends Product {
  quantity: number;
}
