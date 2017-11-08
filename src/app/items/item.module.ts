import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemComponent } from './item.component';

const components: any = [
  ItemComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: components,
  exports: components
})

export class ItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ItemModule,
      providers: []
    };
  }
}
