import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textToImage'
})

export class TextToImage implements PipeTransform {
  private replaceWithImage(__: any, name: string, index: string): string {
    let target = name;
    if ( !!index ) {
      target += index;
    }
    return `<img src="/assets/items/${target}.png" class="inline">`;
  }

  transform(value: string): string {
    return value.replace(/\{(\w+?)(\d+)?\}/g, this.replaceWithImage);
  }
}
