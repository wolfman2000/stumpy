import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetComponent } from './reset.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResetComponent],
  exports: [ResetComponent]
})

export class ResetModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ResetModule,
      providers: []
    };
  }
}
