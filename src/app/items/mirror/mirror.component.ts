import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-mirror',
  templateUrl: './mirror.component.html',
  styleUrls: ['../item.component.css', './mirror.component.css']
})
export class MirrorComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.mirror
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMirror();
  }
}
