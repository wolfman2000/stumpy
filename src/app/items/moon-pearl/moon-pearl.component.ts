import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-moon-pearl',
  templateUrl: './moon-pearl.component.html',
  styleUrls: ['../item.component.css', './moon-pearl.component.css']
})
export class MoonPearlComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.moonPearl
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMoonPearl();
  }
}
