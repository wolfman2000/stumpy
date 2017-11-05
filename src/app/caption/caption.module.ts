import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaptionComponent } from './caption.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CaptionComponent],
  exports: [CaptionComponent]
})

export class CaptionModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CaptionModule,
      providers: []
    };
  }
}
