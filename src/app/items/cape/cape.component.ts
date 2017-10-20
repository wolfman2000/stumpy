import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-cape',
  templateUrl: './cape.component.html',
  styleUrls: ['../item.component.css', './cape.component.css']
})
export class CapeComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.cape
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleCape();
  }
} /* istanbul ignore next */
