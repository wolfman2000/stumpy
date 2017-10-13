import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-net',
  templateUrl: './net.component.html',
  styleUrls: ['../item.component.css', './net.component.css']
})
export class NetComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.net
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleNet();
  }
}
