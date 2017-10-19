import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'stumpy-book',
  templateUrl: './book.component.html',
  styleUrls: ['../item.component.css', './book.component.css']
})
export class BookComponent {

  constructor(
    private inventoryService: InventoryService
  ) {}

  getClasses(): any {
    return {
      isActive: this.inventoryService.book
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBook();
  }

} /* istanbul ignore next */
