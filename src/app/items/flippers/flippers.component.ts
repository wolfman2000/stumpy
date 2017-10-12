import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-flippers',
  templateUrl: './flippers.component.html',
  styleUrls: ['../item.component.css', './flippers.component.css']
})
export class FlippersComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.flippers
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleFlippers();
  }
}
