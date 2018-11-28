import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from './item.service';

@Component( {
  providers: [],
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

    this._itemService.saveState();
  }

  getClasses(): any {
    return this._itemService.getItemClasses(this.itemId);
  }
}
