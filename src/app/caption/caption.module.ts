import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaptionComponent } from './caption.component';
import { TextToImage } from './text-to-image.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CaptionComponent, TextToImage],
  exports: [CaptionComponent, TextToImage]
})

export class CaptionModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CaptionModule,
      providers: []
    };
  }
}
