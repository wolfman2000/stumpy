import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-moon-pearl',
  templateUrl: './moon-pearl.component.html',
  styleUrls: ['../item.component.css', './moon-pearl.component.css']
})
export class MoonPearlComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.moonPearl
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMoonPearl();
  }
} /* istanbul ignore next */
