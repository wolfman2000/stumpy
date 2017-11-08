import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from './item.service';

@Component( {
  providers: [ItemService],
  selector: 'stumpy-item',
  templateUrl: './item.component.html',
  styleUrls: [ './item.component.css' ]
} )

export class ItemComponent {
  constructor(
    protected _itemService: ItemService
  ) {}

  @Input()
  itemId: number;

  whenClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this._itemService.setItemState(this.itemId, this._itemService.getItem(this.itemId).state + 1);
  }

  getClasses(): any {
    const results = {
      isActive: this._itemService.isActive(this.itemId)
    };
    results[this._itemService.getImage(this.itemId)] = true;
    return results;
  }
}
