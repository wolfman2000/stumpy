import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { Shield } from './shield';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-shield',
  templateUrl: './shield.component.html',
  styleUrls: ['../item.component.css', './shield.component.css']
})
export class ShieldComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    const shield: Shield = this.inventoryService.shield;
    return {
      isActive: shield !== Shield.None,
      shield1: shield === Shield.None || shield === Shield.Small,
      shield2: shield === Shield.Magic,
      shield3: shield === Shield.Mirror
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.incrementShield();
  }
} /* istanbul ignore next */
