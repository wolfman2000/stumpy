import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings/settings.component';
import { RandomizerTrackerComponent } from './tracker.component';

const routes: Routes = [
  { path: '', redirectTo: '/tracker', pathMatch: 'full' },
  { path: 'settings', component: RandomizerSettingsComponent },
  { path: 'tracker', component: RandomizerTrackerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

