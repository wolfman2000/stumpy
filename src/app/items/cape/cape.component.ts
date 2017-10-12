import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-cape',
  templateUrl: './cape.component.html',
  styleUrls: ['../item.component.css', './cape.component.css']
})
export class CapeComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.cape
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleCape();
  }
}
