import { HttpErrorResponse } from "@angular/common/http"

export const getErrorMessage = (error: HttpErrorResponse): string => {
    switch (error.status) {
        case 401:
            return 'Вы не авторизованы'
          case 403:
            return 'Недостаточно прав для выполнения действия'
          case 404:
            return 'Ресурс не найден'
          case 409:
            return 'Конфликт данных'
          case 422:
            return 'Данные заполнены некорректно'
          case 500:
            return 'Ошибка сервера. Попробуйте позже'
          default:
            return 'Произошла неизвестная ошибка'
    }   
}