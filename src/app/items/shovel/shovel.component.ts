import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-shovel',
  templateUrl: './shovel.component.html',
  styleUrls: ['../item.component.css', './shovel.component.css']
})
export class ShovelComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.shovel
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleShovel();
  }
}
