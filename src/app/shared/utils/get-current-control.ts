import { FormControl, FormGroup } from "@angular/forms"
export const getCurrentControl = (form: FormGroup, controlName: string) => {
  return form.get(controlName) as FormControl
}