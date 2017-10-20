import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { LightWorldComponent } from './light-world.component';
import { DarkWorldComponent } from './dark-world.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MapComponent,
    LightWorldComponent,
    DarkWorldComponent
  ],
  exports: [MapComponent]
})

export class MapModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MapModule,
      providers: []
    };
  }
}
