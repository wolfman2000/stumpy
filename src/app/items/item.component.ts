import { Component } from '@angular/core';
import { InventoryService } from '../inventory.service';

@Component( {
  selector: 'app-item',
  styleUrls: [ './item.component.css' ]
} )

export abstract class ItemComponent {
  constructor(
    protected _inventoryService: InventoryService
  ) {}

  protected get inventoryService(): InventoryService {
    return this._inventoryService;
  }

  abstract getClasses(): any;
  abstract whenClicked( evt: MouseEvent ): void;
}
