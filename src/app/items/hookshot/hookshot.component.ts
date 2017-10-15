import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-hookshot',
  templateUrl: './hookshot.component.html',
  styleUrls: ['../item.component.css', './hookshot.component.css']
})
export class HookshotComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.hookshot
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleHookshot();
  }
} /* istanbul ignore next */
