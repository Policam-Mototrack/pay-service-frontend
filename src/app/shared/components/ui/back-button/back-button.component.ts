import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Location } from '@angular/common'

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  router = inject(Router)
  location = inject(Location)
  link = input<string | null>(null)
  customBack = input<boolean>(false)
  text = input<string>('← Назад')

  handleClick(event: Event): void {
    if(!this.customBack()){
      if(this.link() && this.link() !== null){
        this.router.navigateByUrl(this.link() as string)
      }
      if (!this.link()) {
        if (window.history.length > 1) this.location.back();
        else this.router.navigateByUrl('/catalog'); // fallback
      }
  }
  }
}
