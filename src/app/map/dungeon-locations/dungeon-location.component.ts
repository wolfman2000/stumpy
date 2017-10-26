import { Component, Input, OnInit } from '@angular/core';

import { DungeonLocationService } from './dungeon-location.service';
import { DungeonLocation } from './dungeon-location';

import { CamelCasePipe } from '../../camel-case.pipe';

import { Availability } from '../availability';

@Component({
  providers: [CamelCasePipe, DungeonLocationService],
  selector: 'stumpy-dungeon-location',
  templateUrl: './dungeon-location.component.html',
  styleUrls: [ './dungeon-location.component.css']
})

export class DungeonLocationComponent implements OnInit {
  constructor(
    private camelCasePipe: CamelCasePipe,
    private _dungeonLocationService: DungeonLocationService
  ) {}

  @Input()
  dungeonLocationId: number;

  private _dungeonLocation: DungeonLocation;

  ngOnInit() {
    this._dungeonLocation = this._dungeonLocationService.getDungeonLocation(this.dungeonLocationId);
  }

  getSurroundingClasses(): any {
    const results = {
      castle: this.dungeonLocationId === 0,
      dungeon: this.dungeonLocationId !== 0,
      claimed: this._dungeonLocationService.getChestCount(this.dungeonLocationId) === 0
    };

    const availability = this._dungeonLocationService.getChestAvailability(this.dungeonLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }

  getSurroundingStyle(): any {
    return {
      left: this._dungeonLocation.left + '%',
      top: this._dungeonLocation.top + '%'
    };
  }

  getBossClasses(): any {
    const results = {
      claimed: this._dungeonLocationService.isBossDefeated(this.dungeonLocationId)
    };
    results[this.camelCasePipe.transform(this._dungeonLocationService.getBossName(this.dungeonLocationId))] = true;

    const availability = this._dungeonLocationService.getBossAvailability(this.dungeonLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }

  getBossStyle(): any {
    return this.getSurroundingStyle();
  }
}
