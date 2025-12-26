import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AnonymousAuthService } from './features/auth/anonymous-auth/services/anonymous-auth.service'
import { forkJoin } from 'rxjs'
import { LoaderComponent } from './shared/components/loader/loader.component'
import { LoaderService } from './core/services/loader.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ToastContainerComponent } from './shared/components/ui/toast/toast-container.component'
import { ToastService } from './core/services/toast.service'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'pay-service-frontend'
  public loadingText = 'Загрузка...'
  private anonymousAuthService = inject(AnonymousAuthService)
  private destroyRef = inject(DestroyRef)
  public loader = inject(LoaderService)
  private toastService = inject(ToastService)
  initAnonymousAuth() {
    return this.anonymousAuthService.initAnonymousAuth()
  }
  ngOnInit(): void {
    forkJoin([this.initAnonymousAuth()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([response]) => {})
  }
}
