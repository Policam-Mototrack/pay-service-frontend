import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PageContainerComponent } from './shared/components/layouts/page-container/page-container.component'
import { AnonymousAuthService } from './features/auth/anonymous-auth/services/anonymous-auth.service'
import { forkJoin} from 'rxjs'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'pay-service-frontend'
  private anonymousAuthService = inject(AnonymousAuthService);
  initAnonymousAuth() {
    return this.anonymousAuthService.initAnonymousAuth()
  }
  ngOnInit(): void {
    forkJoin([this.initAnonymousAuth()]).subscribe(([response]) => {
     
    })
  }
}
