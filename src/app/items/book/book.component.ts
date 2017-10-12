import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-book',
  templateUrl: './book.component.html',
  styleUrls: ['../item.component.css', './book.component.css']
})
export class BookComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    return {
      isActive: this.inventoryService.book
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.toggleBook();
  }

}
