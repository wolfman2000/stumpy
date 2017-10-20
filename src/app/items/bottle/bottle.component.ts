import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-bottle',
  templateUrl: './bottle.component.html',
  styleUrls: ['../item.component.css', './bottle.component.css']
})
export class BottleComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    const bottles: number = this.inventoryService.bottles;
    const results: any = {
      isActive: bottles !== 0
    };
    results['bottle' + bottles] = true;
    return results;
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.incrementBottles();
  }
} /* istanbul ignore next */
