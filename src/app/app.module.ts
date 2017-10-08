import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { SwordComponent } from './items/sword/sword.component';
import { BowComponent } from './items/bow/bow.component';
import { FireRodComponent } from './items/firerod/firerod.component';
import { IceRodComponent } from './items/icerod/icerod.component';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerSettingsComponent,
    RandomizerTrackerComponent,
    SwordComponent,
    BowComponent,
    FireRodComponent,
    IceRodComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
