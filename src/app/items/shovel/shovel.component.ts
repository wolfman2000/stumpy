import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-shovel',
  templateUrl: './shovel.component.html',
  styleUrls: ['../item.component.css', './shovel.component.css']
})
export class ShovelComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.shovel
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleShovel();
  }
} /* istanbul ignore next */
