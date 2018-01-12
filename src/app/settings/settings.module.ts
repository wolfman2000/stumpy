import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SettingsComponent],
  exports: [SettingsComponent]
})

export class SettingsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SettingsModule,
      providers: []
    };
  }
}
