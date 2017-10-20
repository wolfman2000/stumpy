import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { Tunic } from './tunic';

@Component({
  selector: 'stumpy-tunic',
  templateUrl: './tunic.component.html',
  styleUrls: ['../item.component.css', './tunic.component.css']
})
export class TunicComponent {
  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    const tunic = this.inventoryService.tunic;
    return {
      isActive: true,
      tunic1: tunic === Tunic.Green,
      tunic2: tunic === Tunic.Blue,
      tunic3: tunic === Tunic.Red
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.incrementTunic();
  }
} /* istanbul ignore next */
