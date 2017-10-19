import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-flute',
  templateUrl: './flute.component.html',
  styleUrls: ['../item.component.css', './flute.component.css']
})
export class FluteComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.flute
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleFlute();
  }
} /* istanbul ignore next */
