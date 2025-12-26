import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'

@Component({
  selector: 'app-payment-status-page',
  standalone: true,
  imports: [CommonModule, PageContainerComponent],
  templateUrl: './payment-status-page.component.html',
  styleUrl: './payment-status-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusPageComponent {
  email = input<string>('')
  status = input<string>('Ожидание оплаты...')
  private router = inject(Router)

  returnToHome(): void {
    this.router.navigate(['/'])
  }
}
