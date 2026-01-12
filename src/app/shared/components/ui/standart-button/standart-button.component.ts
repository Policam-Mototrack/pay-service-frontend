import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { NgClass } from '@angular/common'

export type ButtonTheme = 'primary' | 'secondary' | 'tertiary'

@Component({
  selector: 'app-standart-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './standart-button.component.html',
  styleUrl: './standart-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandartButtonComponent {
  theme = input<ButtonTheme>('secondary')
  text = input<string>('')
  type = input<'button' | 'submit' | 'reset'>('button')
  getButtonClasses() {
    return [this.theme(), 'standart-button']
  }
}
