import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component( {
  providers: [InventoryService],
  selector: 'stumpy-bow',
  templateUrl: './bow.component.html',
  styleUrls: ['../item.component.css', './bow.component.css']
})

export class BowComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.bow
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBow();
  }
} /* istanbul ignore next */
