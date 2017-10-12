import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-mushroom',
  templateUrl: './mushroom.component.html',
  styleUrls: ['../item.component.css', './mushroom.component.css']
})
export class MushroomComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.mushroom
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMushroom();
  }
}
