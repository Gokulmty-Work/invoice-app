import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = event.target.value;
    event.target.value = initialValue.replace(/[^0-9.]/g, ''); // Allow only digits and dot
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
    // Prevent more than one dot
    if ((event.target.value.match(/\./g) || []).length > 1) {
      event.target.value = event.target.value.slice(0, -1);
    }
  }
}
