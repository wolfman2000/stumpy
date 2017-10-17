import { Component } from '@angular/core';
import { InventoryService } from '../inventory.service';

@Component( {
  selector: 'app-item',
  template: '<div></div>',
  styleUrls: [ './item.component.css' ]
} )

export class ItemComponent {
  constructor(
    protected _inventoryService: InventoryService
  ) {}

  protected get inventoryService(): InventoryService {
    return this._inventoryService;
  }

  getClasses(): any {
  }
  whenClicked( evt: MouseEvent ): void {
  }
}
