import { Component, Input, OnInit } from '@angular/core';

import { Availability } from '../availability';
import { ItemLocation } from './item-location';
import { ItemLocationService } from './item-location.service';
import { CamelCasePipe } from '../../camel-case.pipe';

@Component({
  providers: [CamelCasePipe, ItemLocationService],
  selector: 'stumpy-item-location',
  templateUrl: './item-location.component.html',
  styleUrls: [ './item-location.component.css']
})

export class ItemLocationComponent implements OnInit {
  constructor(
    private camelCasePipe: CamelCasePipe,
    private _itemLocationService: ItemLocationService
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

    this.itemLocation.toggleOpened();
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
      claimed: this.itemLocation.isOpened
    };

    const availability = this._itemLocationService.getAvailability(this.itemLocationId);
    results[this.camelCasePipe.transform(Availability[availability])] = true;
    return results;
  }
} /* istanbul ignore next */
