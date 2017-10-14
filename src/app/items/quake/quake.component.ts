import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-quake',
  templateUrl: './quake.component.html',
  styleUrls: ['../item.component.css', './quake.component.css']
})
export class QuakeComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.quake
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleQuake();
  }
} /* istanbul ignore next */
