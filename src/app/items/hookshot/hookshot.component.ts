import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-hookshot',
  templateUrl: './hookshot.component.html',
  styleUrls: ['../item.component.css', './hookshot.component.css']
})
export class HookshotComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.hookshot
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleHookshot();
  }
}
