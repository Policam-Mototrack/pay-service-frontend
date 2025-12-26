import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ToastService } from '../../../../core/services/toast.service'
import { Toast } from '../../../../core/services/toast.service'

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toast = input.required<Toast>()
  private toastService = inject(ToastService)

  close(): void {
    this.toastService.remove(this.toast().id)
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }
}
