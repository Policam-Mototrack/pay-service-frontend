import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  // FormControl для привязки
  control = input.required<FormControl>()

  // Текст лейбла
  label = input.required<string>()

  // Обязательное поле
  required = input<boolean>(false)

  // Placeholder
  placeholder = input<string>('')

  // Тип инпута (text, email, password, etc.)
  type = input<string>('text')

  // Тип поля (input, select, textarea)
  fieldType = input<'input' | 'select' | 'textarea'>('input')

  // Опции для select
  options = input<{ value: string; label: string }[]>([])

  // Подсказка под полем
  hint = input<string>('')

  // ID для связи label и input
  fieldId = input<string>('')
}
