import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-boots',
  templateUrl: './boots.component.html',
  styleUrls: [ '../item.component.css', './boots.component.css']
})
export class BootsComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.boots
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBoots();
  }
}
