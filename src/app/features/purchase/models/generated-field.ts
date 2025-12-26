import { FormControl } from "@angular/forms"

export interface IGeneratedField {
    name: string
    title: string
    type: 'string' | 'number' | 'boolean' | 'date'
    control: FormControl
}