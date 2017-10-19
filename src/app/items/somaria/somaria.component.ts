import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-somaria',
  templateUrl: './somaria.component.html',
  styleUrls: ['../item.component.css', './somaria.component.css']
})
export class SomariaComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.somaria
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleSomaria();
  }
} /* istanbul ignore next */
