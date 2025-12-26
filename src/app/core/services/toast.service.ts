import { Injectable, signal } from '@angular/core'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = signal<Toast[]>([])
  readonly toasts = this._toasts.asReadonly()

  show(message: string, type: ToastType = 'info', duration: number = 5000): void {
    const id = this.generateId()
    const toast: Toast = { id, message, type, duration }

    this._toasts.update((toasts) => [...toasts, toast])

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration)
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration)
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration)
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration)
  }

  remove(id: string): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id))
  }

  clear(): void {
    this._toasts.set([])
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
