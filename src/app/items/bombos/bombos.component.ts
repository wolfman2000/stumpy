import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-bombos',
  templateUrl: './bombos.component.html',
  styleUrls: [ '../item.component.css', './bombos.component.css']
})
export class BombosComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.bombos
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBombos();
  }
}