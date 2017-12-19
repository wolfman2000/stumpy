import { Component, Input, OnInit } from '@angular/core';

import { Availability } from '../availability';
import { ItemLocation } from './item-location';
import { ItemLocationService } from './item-location.service';

import { CaptionService } from '../../caption/caption.service';
import { CamelCasePipe } from '../../camel-case.pipe';

@Component({
  providers: [CamelCasePipe],
  selector: 'stumpy-item-location',
  templateUrl: './item-location.component.html',
  styleUrls: [ './item-location.component.css']
})

export class ItemLocationComponent implements OnInit {
  constructor(
    private camelCasePipe: CamelCasePipe,
    private _itemLocationService: ItemLocationService,
    private _captionService: CaptionService
  ) {
  }

  @Input()
  itemLocationId: number;

  private itemLocation: ItemLocation;

  ngOnInit() {
    this.itemLocation = this._itemLocationService.getItemLocation(this.itemLocationId);
  }

  whenClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    if ( this._itemLocationService.canToggleOpened(this.itemLocationId)) {
      this.itemLocation.toggleOpened();
    }
  }

  whenInside(evt: MouseEvent): void {
    const requirements = this.itemLocation.requirements;
    if ( !requirements || requirements === '' ) {
      this._captionService.message = this.itemLocation.name;
    } else {
      this._captionService.message = this.itemLocation.name + ': ' + this.itemLocation.requirements;
    }
  }

  whenOutside(evt: MouseEvent): void {
    this._captionService.message = '';
  }

  getStyle(): any {
    return {
      left: this.itemLocation.left + '%',
      top: this.itemLocation.top + '%'
    };
  }

  getClasses(): any {
    const results: any = {
      itemLocation: true,
      claimed: this._itemLocationService.isClaimed(this.itemLocationId)
    };

    const availability = this._itemLocationService.getAvailability(this.itemLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }
} /* istanbul ignore next */
