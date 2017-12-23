import { Component } from '@angular/core';

import { GoModeService } from './go-mode.service';
import { SettingsService } from '../settings/settings.service';
import { CamelCasePipe } from '../camel-case.pipe';
import { Availability } from '../map/availability';

@Component({
  selector: 'stumpy-go-mode',
  templateUrl: './go-mode.component.html',
  styleUrls: ['./go-mode.component.css']
})

export class GoModeComponent {
  constructor(
    private _goMode: GoModeService,
    private camelCasePipe: CamelCasePipe,
    private _settings: SettingsService
  ) {}

  getGoModeClasses(): any {
    if ( !this._settings.showGoMode ) {
      return {
        hidden: true
      };
    }

    const results = {
      alert: true
    };

    const availability = this._goMode.isGoMode();
    results[this.camelCasePipe.transform(Availability[availability])] = true;


    switch ( availability ) {
      case Availability.Available:
        results['alert-success'] = true;
        break;
      case Availability.Possible:
        results['alert-warning'] = true;
        break;
      case Availability.Glitches:
        results['alert-danger'] = true;
        break;
      case Availability.Unavailable:
        results['hidden'] = true;
    }

    return results;
  }
}
