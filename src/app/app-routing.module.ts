import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings.component';
import { RandomizerTrackerComponent } from './tracker.component';

const routes: Routes = [
  { path: '', redirectTo: '/settings', pathMatch: 'full' },
  { path: 'settings', component: RandomizerSettingsComponent },
  { path: 'tracker/:mode/:logic', component: RandomizerTrackerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

