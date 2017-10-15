import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-boots',
  templateUrl: './boots.component.html',
  styleUrls: [ '../item.component.css', './boots.component.css']
})
export class BootsComponent {

  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.boots
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBoots();
  }
} /* istanbul ignore next */
