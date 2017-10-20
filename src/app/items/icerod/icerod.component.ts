import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component( {
  selector: 'stumpy-icerod',
  templateUrl: './icerod.component.html',
  styleUrls: ['../item.component.css', './icerod.component.css']
})

export class IceRodComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.iceRod
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleIceRod();
  }
} /* istanbul ignore next */
