import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-silver-arrows',
  templateUrl: './silver-arrows.component.html',
  styleUrls: ['../item.component.css', './silver-arrows.component.css']
})
export class SilverArrowsComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.silverArrows
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleSilverArrows();
  }
} /* istanbul ignore next */
