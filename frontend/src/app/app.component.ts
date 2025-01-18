import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, ProductsListComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'eCommerce';
}
