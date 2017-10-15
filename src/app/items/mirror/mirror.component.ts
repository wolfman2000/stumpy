import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-mirror',
  templateUrl: './mirror.component.html',
  styleUrls: ['../item.component.css', './mirror.component.css']
})
export class MirrorComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.mirror
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleMirror();
  }
} /* istanbul ignore next */
