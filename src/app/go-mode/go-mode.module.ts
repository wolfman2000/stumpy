import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoModeComponent } from './go-mode.component';
import { GoModeService } from './go-mode.service';

@NgModule({
  imports: [CommonModule],
  declarations: [GoModeComponent],
  exports: [GoModeComponent]
})

export class GoModeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GoModeModule,
      providers: [GoModeService]
    };
  }
}
