import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-powder',
  templateUrl: './powder.component.html',
  styleUrls: ['../item.component.css', './powder.component.css']
})
export class PowderComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.powder
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.togglePowder();
  }
}
