import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-somaria',
  templateUrl: './somaria.component.html',
  styleUrls: ['../item.component.css', './somaria.component.css']
})
export class SomariaComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.somaria
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleSomaria();
  }
}
