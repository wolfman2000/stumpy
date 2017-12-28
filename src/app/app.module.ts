import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { CaptionModule } from './caption/caption.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';
import { GuideModule } from './guide/guide.module';
import { ResetModule } from './reset/reset.module';
import { GoModeModule } from './go-mode/go-mode.module';

import { LocalStorageService } from './local-storage.service';
import { CaptionService } from './caption/caption.service';
import { DungeonService } from './dungeon/dungeon.service';
import { DungeonLocationService } from './map/dungeon-locations/dungeon-location.service';
import { ItemService } from './items/item.service';
import { ItemLocationService } from './map/item-locations/item-location.service';
import { SettingsService } from './settings/settings.service';
import { BossService } from './boss/boss.service';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings/settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { DungeonComponent } from './dungeon/dungeon.component';

import { CamelCasePipe } from './camel-case.pipe';
import { WordSpacingPipe } from './word-spacing.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerSettingsComponent,
    RandomizerTrackerComponent,
    DungeonComponent,
    CamelCasePipe,
    WordSpacingPipe
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CaptionModule.forRoot(),
    MapModule.forRoot(),
    ItemModule.forRoot(),
    GuideModule.forRoot(),
    ResetModule.forRoot(),
    GoModeModule.forRoot()
  ],
  providers: [
    CamelCasePipe,
    WordSpacingPipe,
    ItemService,
    ItemLocationService,
    CaptionService,
    DungeonService,
    DungeonLocationService,
    LocalStorageService,
    SettingsService,
    BossService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
