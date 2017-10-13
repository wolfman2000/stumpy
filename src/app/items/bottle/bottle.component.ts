import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-bottle',
  templateUrl: './bottle.component.html',
  styleUrls: ['../item.component.css', './bottle.component.css']
})
export class BottleComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

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
}
