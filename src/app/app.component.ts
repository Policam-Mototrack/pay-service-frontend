import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PageContainerComponent } from './shared/components/layouts/page-container/page-container.component'
import { AnonymousAuthService } from './features/auth/anonymous-auth/services/anonymous-auth.service'
import { forkJoin } from 'rxjs'
import { LoaderComponent } from './shared/components/loader/loader.component'
import { LoaderService } from './core/services/loader.service'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageContainerComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'pay-service-frontend'
  public loadingText = 'Загрузка...'
  private anonymousAuthService = inject(AnonymousAuthService)
  public loader = inject(LoaderService)
  initAnonymousAuth() {
    return this.anonymousAuthService.initAnonymousAuth()
  }
  ngOnInit(): void {
    forkJoin([this.initAnonymousAuth()]).subscribe(([response]) => {})
  }
}
