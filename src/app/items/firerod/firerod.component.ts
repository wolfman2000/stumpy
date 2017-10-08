import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component( {
  providers: [InventoryService],
  selector: 'stumpy-firerod',
  templateUrl: './firerod.component.html',
  styleUrls: ['../item.component.css', './firerod.component.css']
})

export class FireRodComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.fireRod
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleFireRod();
  }
}
