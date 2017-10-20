import { Component } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { SettingsService } from '../../settings/settings.service';
import { Sword } from './sword';
import { Mode } from '../../settings/mode';

@Component( {
  selector: 'stumpy-sword',
  templateUrl: './sword.component.html',
  styleUrls: [ '../item.component.css', './sword.component.css' ]
} )

export class SwordComponent {
  constructor(
    private inventoryService: InventoryService,
    private settingsService: SettingsService
  ) {}

  getClasses(): any {
    const sword = this.inventoryService.sword;
    const result: any = {
      swordless: this.settingsService.mode === Mode.Swordless,
      isActive: sword !== Sword.None
    };

    switch ( sword ) {
      case Sword.None:
      case Sword.Wooden:
        result.sword1 = true;
        break;
      case Sword.Master:
        result.sword2 = true;
        break;
      case Sword.Tempered:
        result.sword3 = true;
        break;
      case Sword.Golden:
        result.sword4 = true;
        break;
    }

    return result;
  }

  whenClicked(evt: MouseEvent) {
    if ( this.settingsService.mode !== Mode.Swordless ) {
      this.inventoryService.incrementSword();
    }
  }
} /* istanbul ignore next */
