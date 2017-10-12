import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-boomerang',
  templateUrl: './boomerang.component.html',
  styleUrls: ['../item.component.css', './boomerang.component.css']
})
export class BoomerangComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      blueBoomerang: this.inventoryService.blueBoomerang || !this.inventoryService.redBoomerang,
      redBoomerang: this.inventoryService.redBoomerang,
      isActive: this.inventoryService.blueBoomerang || this.inventoryService.redBoomerang
    };
  }

  whenClicked(evt: MouseEvent) {

    if (this.inventoryService.blueBoomerang) {
      this.inventoryService.toggleRedBoomerang();
    }

    this.inventoryService.toggleBlueBoomerang();
  }
}
