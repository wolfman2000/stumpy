import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-lantern',
  templateUrl: './lantern.component.html',
  styleUrls: ['../item.component.css', './lantern.component.css']
})
export class LanternComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.lantern
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleLantern();
  }
} /* istanbul ignore next */
