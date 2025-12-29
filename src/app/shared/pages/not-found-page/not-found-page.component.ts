import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { PageContainerComponent } from '../../components/layouts/page-container/page-container.component'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PageContainerComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent implements OnInit {
  private title = inject(Title)

  ngOnInit(): void {
    this.title.setTitle('Страница не найдена')
  }
}

