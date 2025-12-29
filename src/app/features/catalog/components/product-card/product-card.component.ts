import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { IProduct } from '../../../../core/models/product.interface'

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product!: IProduct
}
