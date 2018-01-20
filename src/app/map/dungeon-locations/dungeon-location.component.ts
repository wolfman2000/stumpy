import { Component, Input, OnInit } from '@angular/core';

import { DungeonLocationService } from './dungeon-location.service';
import { DungeonLocation } from './dungeon-location';

import { CaptionService } from '../../caption/caption.service';
import { CamelCasePipe } from '../../camel-case.pipe';

import { Availability } from '../availability';

@Component({
  selector: 'stumpy-dungeon-location',
  templateUrl: './dungeon-location.component.html',
  styleUrls: [ './dungeon-location.component.css']
})

export class DungeonLocationComponent implements OnInit {
  constructor(
    private camelCasePipe: CamelCasePipe,
    private _dungeonLocationService: DungeonLocationService,
    private _captionService: CaptionService
  ) {}

  @Input()
  dungeonLocationId: number;

  private _dungeonLocation: DungeonLocation;

  ngOnInit() {
    this._dungeonLocation = this._dungeonLocationService.getDungeonLocation(this.dungeonLocationId);
  }

  getSurroundingClasses(): any {
    const results = {
      dungeon: true,
      claimed: this._dungeonLocationService.hasChestsOrBossClaimed(this.dungeonLocationId)
    };

    const availability = this._dungeonLocationService.getChestAvailability(this.dungeonLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }

  getTreasureClasses(): any {
    const results = {
      claimed: this._dungeonLocationService.hasChestsOrBossClaimed(this.dungeonLocationId)
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

    const availability = this._dungeonLocationService.getBossAvailability(this.dungeonLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }

  getBossBackground(): string {
    return 'url(#' + this.camelCasePipe.transform(this._dungeonLocationService.getBossName(this.dungeonLocationId)) + ')';
  }

  whenInside(evt: MouseEvent): void {
    const requirements = this._dungeonLocation.requirements;
    if ( !requirements || requirements === '' ) {
      this._captionService.message = this._dungeonLocation.name;
    } else {
      this._captionService.message = this._dungeonLocation.name + ': ' + this._dungeonLocation.requirements;
    }
  }

  whenOutside(evt: MouseEvent): void {
    this._captionService.message = '';
  }
}
