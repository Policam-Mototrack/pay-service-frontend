import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

export interface RadioOption {
  value: string
  label: string
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent {
  // FormControl для привязки
  control = input.required<FormControl>()

  // Текст лейбла
  label = input.required<string>()

  // Обязательное поле
  required = input<boolean>(false)

  // Опции для radio buttons
  options = input.required<RadioOption[]>()

  // Имя группы (для связи radio buttons)
  name = input.required<string>()

  // Наличие ошибки (передается извне)
  hasError = input<boolean>(false)

  // Текст ошибки (передается извне)
  errorMessage = input<string>('')
}
