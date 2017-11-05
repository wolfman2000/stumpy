import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { CaptionModule } from './caption/caption.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';
import { GuideModule } from './guide/guide.module';

import { LocalStorageService } from './local-storage.service';
import { CaptionService } from './caption/caption.service';
import { DungeonService } from './dungeon/dungeon.service';
import { InventoryService } from './inventory.service';
import { SettingsService } from './settings/settings.service';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings/settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { DungeonComponent } from './dungeon/dungeon.component';

import { CamelCasePipe } from './camel-case.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerSettingsComponent,
    RandomizerTrackerComponent,
    DungeonComponent,
    CamelCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CaptionModule.forRoot(),
    MapModule.forRoot(),
    ItemModule.forRoot(),
    GuideModule.forRoot()
  ],
  providers: [InventoryService, CaptionService, DungeonService, LocalStorageService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
