import { ItemService } from './item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { Mode } from '../settings/mode';

import { Sword } from './sword';
import { Item } from './item';
import { ItemKey } from './item-key';

describe( 'The item service -- in swordless mode --', () => {
  let itemService: ItemService;
  let settingsService: SettingsService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService());
    spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Swordless );
  });

  beforeEach(() => {
    itemService = new ItemService( settingsService );
  });

  it( 'starts without a sword.', () => {
    expect( itemService.sword ).toBe( Sword.None );
  });

  it( 'will always stay without a sword while swordless mode is on.', () => {
    itemService.setItemState( ItemKey.Sword, Sword.Tempered );

    expect( itemService.sword ).toBe( Sword.None );
  });
});
