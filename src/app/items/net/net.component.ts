import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-net',
  templateUrl: './net.component.html',
  styleUrls: ['../item.component.css', './net.component.css']
})
export class NetComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.net
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleNet();
  }
} /* istanbul ignore next */
