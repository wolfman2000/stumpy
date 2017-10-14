import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-mushroom',
  templateUrl: './mushroom.component.html',
  styleUrls: ['../item.component.css', './mushroom.component.css']
})
export class MushroomComponent{
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.mushroom
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMushroom();
  }
} /* istanbul ignore next */
