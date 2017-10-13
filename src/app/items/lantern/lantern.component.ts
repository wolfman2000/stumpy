import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-lantern',
  templateUrl: './lantern.component.html',
  styleUrls: ['../item.component.css', './lantern.component.css']
})
export class LanternComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.lantern
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleLantern();
  }
}
