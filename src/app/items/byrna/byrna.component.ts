import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-byrna',
  templateUrl: './byrna.component.html',
  styleUrls: ['../item.component.css', './byrna.component.css']
})
export class ByrnaComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.byrna
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleByrna();
  }
}
