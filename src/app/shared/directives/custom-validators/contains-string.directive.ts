import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ContainsString]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ContainsStringDirective, multi: true }]
})
export class ContainsStringDirective implements Validator {
  @Input('ContainsString') ContainsString: string;

  validate(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    // Check if the value contains the required string
    if (value && !value.includes(this.ContainsString)) {
      // If it does not include the string, return an error object
      return { 'containsString': { value: this.ContainsString } };
    }
    return null; // If the validation passes, return null
  }
}
