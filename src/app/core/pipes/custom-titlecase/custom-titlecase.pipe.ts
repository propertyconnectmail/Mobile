import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTitlecase'
})
export class CustomTitlecasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const acronyms = ['PHI', 'CEO', 'IT', 'HR'];
    return value
      .split(' ')
      .map(word => {
        const upperWord = word.toUpperCase();
        return acronyms.includes(upperWord) ? upperWord : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
