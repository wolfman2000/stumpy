import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-ether',
  templateUrl: './ether.component.html',
  styleUrls: ['../item.component.css', './ether.component.css']
})
export class EtherComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.ether
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleEther();
  }
}
