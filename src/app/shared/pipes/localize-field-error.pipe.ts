import { Pipe, PipeTransform } from "@angular/core";
import { RuValidatorErrors } from "../localization/localization-errors";
import { FormControl } from "@angular/forms";

@Pipe({
    name: 'localizeFieldError',
    standalone: true,
})
export class LocalizeFieldErrorPipe implements PipeTransform {
    transform(control: FormControl): string {
        const errorKey = Object.keys(control.errors || {})[0]
        return RuValidatorErrors[errorKey]
    }
}