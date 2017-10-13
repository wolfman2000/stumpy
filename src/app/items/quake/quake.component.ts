import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-quake',
  templateUrl: './quake.component.html',
  styleUrls: ['../item.component.css', './quake.component.css']
})
export class QuakeComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.quake
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleQuake();
  }
}
