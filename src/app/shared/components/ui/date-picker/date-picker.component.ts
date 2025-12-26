import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  // FormControl для привязки
  control = input.required<FormControl>()
  
  // Текст лейбла
  label = input.required<string>()
  
  // Обязательное поле
  required = input<boolean>(false)
  
  // Placeholder
  placeholder = input<string>('')
  
  // ID для связи label и input
  fieldId = input<string>('')
  
  // Минимальная дата
  min = input<string>('')
  
  // Максимальная дата
  max = input<string>('')

  // Наличие ошибки (передается извне)
  hasError = input<boolean>(false)

  // Текст ошибки (передается извне)
  errorMessage = input<string>('')
}

