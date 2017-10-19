import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-flippers',
  templateUrl: './flippers.component.html',
  styleUrls: ['../item.component.css', './flippers.component.css']
})
export class FlippersComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.flippers
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleFlippers();
  }
} /* istanbul ignore next */
