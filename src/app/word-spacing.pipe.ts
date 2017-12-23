import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordSpacing'
})
export class WordSpacingPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
