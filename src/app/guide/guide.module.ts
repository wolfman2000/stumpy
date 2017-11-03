import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuideComponent } from './guide.component';

@NgModule({
  imports: [CommonModule],
  declarations: [GuideComponent],
  exports: [GuideComponent]
})

export class GuideModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GuideModule,
      providers: []
    };
  }
}
