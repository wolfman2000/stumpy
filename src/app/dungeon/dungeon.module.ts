import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DungeonComponent } from './dungeon.component';
import { DungeonsComponent } from './dungeons.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DungeonComponent, DungeonsComponent],
  exports: [DungeonComponent, DungeonsComponent]
})

export class DungeonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DungeonModule,
      providers: []
    };
  }
}
