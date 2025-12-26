export const RuValidatorErrors: any = {
  required: 'Обязательное поле',
  minlength: (error: { requiredLength: number }) => `Минимум ${error.requiredLength} символа`,
  maxlength: (error: { requiredLength: number }) => `Максимум ${error.requiredLength} символов`,
  email: 'Некорректный email',
}