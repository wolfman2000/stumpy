import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-hammer',
  templateUrl: './hammer.component.html',
  styleUrls: ['../item.component.css', './hammer.component.css']
})
export class HammerComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.hammer
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleHammer();
  }
} /* istanbul ignore next */
