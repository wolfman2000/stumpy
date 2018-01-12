import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationComponent } from './navigation.component';

import { SettingsModule } from '../settings/settings.module';
import { GuideModule } from '../guide/guide.module';
import { ResetModule } from '../reset/reset.module';
import { GoModeModule } from '../go-mode/go-mode.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsModule.forRoot(),
    GuideModule.forRoot(),
    ResetModule.forRoot(),
    GoModeModule.forRoot()
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent]
})

export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavigationModule,
      providers: []
    };
  }
}
