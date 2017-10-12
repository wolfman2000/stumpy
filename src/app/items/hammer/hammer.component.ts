import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-hammer',
  templateUrl: './hammer.component.html',
  styleUrls: ['../item.component.css', './hammer.component.css']
})
export class HammerComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.hammer
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleHammer();
  }
}
