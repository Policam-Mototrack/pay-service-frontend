import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageContainerComponent } from './shared/components/layouts/page-container/page-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pay-service-frontend';
}
