import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-flute',
  templateUrl: './flute.component.html',
  styleUrls: ['../item.component.css', './flute.component.css']
})
export class FluteComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.flute
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleFlute();
  }
}
