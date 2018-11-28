import { Component } from '@angular/core';

import { ItemService } from '../items/item.service';
import { ItemLocationService } from '../map/item-locations/item-location.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { DungeonLocationService } from '../map/dungeon-locations/dungeon-location.service';
import { SaveService } from '../save.service';

@Component( {
  providers: [],
  selector: 'stumpy-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css' ]
})

export class ResetComponent {
  constructor(
    private _itemService: ItemService,
    private _itemLocationService: ItemLocationService,
    private _dungeonService: DungeonService,
    private _dungeonLocationService: DungeonLocationService,
    private _saveService: SaveService
  ) {}

  whenClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this._itemService.reset();
    this._itemLocationService.reset();
    this._dungeonService.reset();
    this._dungeonLocationService.reset();
    this._saveService.reset();
  }
}
