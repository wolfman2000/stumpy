import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-byrna',
  templateUrl: './byrna.component.html',
  styleUrls: ['../item.component.css', './byrna.component.css']
})
export class ByrnaComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.byrna
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleByrna();
  }
} /* istanbul ignore next */
