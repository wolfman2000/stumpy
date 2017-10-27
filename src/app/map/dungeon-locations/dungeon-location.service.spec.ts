import { DungeonLocationService } from './dungeon-location.service';
import { InventoryService } from '../../inventory.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';

import { DungeonLocation } from './dungeon-location';
import { Availability } from '../availability';

import { Location } from '../../dungeon/location';
import { Mode } from '../../settings/mode';

describe( 'The dungeon location service', () => {
  let dungeonLocationService: DungeonLocationService;
  let inventoryService: InventoryService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService());
    spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Standard );
  });

  beforeEach(() => {
    const store: any = {};

    spyOn( localStorage, 'getItem' ).and.callFake( (key: string): string => {
      return store[key] || null;
    });

    spyOn( localStorage, 'removeItem' ).and.callFake( (key: string): void => {
      delete store[key];
    });

    spyOn( localStorage, 'setItem' ).and.callFake( (key: string, value: string): void => {
      store[key] = value;
    });
  });

  beforeEach( () => {
    inventoryService = new InventoryService();
    dungeonService = new DungeonService();
    dungeonLocationService = new DungeonLocationService( inventoryService, dungeonService, settingsService );
  });

  describe( 'set to Agahnim\'s Tower', () => {
    const location = Location.AgahnimTower;

    describe( 'with a sword available', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'can be made available with the master sword, with a sequence break.', () => {
        inventoryService.incrementSword();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be made available with the master sword and the lantern.', () => {
        inventoryService.incrementSword();
        inventoryService.incrementSword();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Available );
      });
    });

    describe( 'in swordless mode', () => {
      const tempSettings = new SettingsService(new LocalStorageService());
      let tempService: DungeonLocationService;

      beforeEach( () => {
        spyOnProperty(tempSettings, 'mode', 'get').and.returnValue(Mode.Swordless);
        tempService = new DungeonLocationService( inventoryService, dungeonService, tempSettings );
      });

      it( 'starts off as unavailable.', () => {
        expect( tempService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'is still unavailable if you can get in with a cape.', () => {
        inventoryService.toggleCape();

        expect( tempService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'can be beaten with the net, though is tricky without the lamp.', () => {
        inventoryService.toggleCape();
        inventoryService.toggleNet();

        expect( tempService.getChestAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be beaten cleanly with the net and lantern.', () => {
        inventoryService.toggleCape();
        inventoryService.toggleNet();
        inventoryService.toggleLantern();

        expect( tempService.getChestAvailability(location)).toBe( Availability.Available );
      });
    });
  });

  describe( 'set to the Eastern Palace', () => {
    const location = Location.EasternPalace;

    describe( '-- the boss --', () => {
      it( 'cannot be beaten at the start.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'can be beaten with the bow, if dark rooms can be navigated.', () => {
        inventoryService.toggleBow();

        expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be beaten easily with the bow and lantern.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Available );
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as available to get all.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Available );
      });

      it( 'may be possible, may not be if one chest is claimed and the lantern is not on hand.', () => {
        dungeonService.getDungeon(location).decrementChestCount();

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Possible );
      });

      it( 'may be possible, may not be if one chest is left and the bow is not on hand.', () => {
        dungeonService.getDungeon(location).decrementChestCount();
        dungeonService.getDungeon(location).decrementChestCount();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Possible );
      });
    });
  });

  describe( 'set to the Desert Palace', () => {
    const location = Location.DesertPalace;

    describe( '-- the boss --', () => {
      it( 'cannot be defeated without a melee weapon, bow, cane, or rod.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than a weapon to approach the doorway.', () => {
        inventoryService.incrementSword();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires the book and glove to get into the doorway, with the boss still unavailable.', () => {
        inventoryService.incrementSword();
        inventoryService.toggleBook();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can be beaten with the fire rod, assuming boots were not required to get in.', () => {
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleFlute();
        inventoryService.toggleMirror();
        inventoryService.toggleFireRod();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can be beaten with the fire rod cleanly if the boots were retrieved beforehand.', () => {
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleFlute();
        inventoryService.toggleMirror();
        inventoryService.toggleFireRod();
        inventoryService.toggleBoots();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'requires entry into the dungeon first.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can be fully raided with a glove, fire source, and boots.', () => {
        inventoryService.toggleBook();
        inventoryService.incrementGlove();
        inventoryService.toggleFireRod();
        inventoryService.toggleBoots();
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is possible to raid with just the book, though it depends on luck.', () => {
        inventoryService.toggleBook();
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'may appear doable if you only have the boots and both items to find.', () => {
        inventoryService.toggleBook();
        inventoryService.toggleBoots();
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });
    });
  });

  describe( 'set to the Tower of Hera', () => {
    const location = Location.TowerOfHera;

    it( 'starts off as unavailable to reach.', () => {
      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
    });

    it( 'can be boss-defeatable with a melee weapon, but the gates are not reachable yet.', () => {
      inventoryService.toggleHammer();

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
    });

    it( 'requires access to death mountain to think about entering.', () => {
      inventoryService.toggleHammer();
      inventoryService.incrementGlove();

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
    });

    it( 'is potentially completable if you are missing a fire source.', () => {
      inventoryService.toggleHammer();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Possible );
    });

    it( 'can be beaten with the fire rod for lighting torches, but the caves must be navigated in the dark first.', () => {
      inventoryService.toggleHammer();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();
      inventoryService.toggleFireRod();

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Glitches );
    });

    it( 'can be beaten with the lantern for lighting torches, allowing the cave entrance to be lit.', () => {
      inventoryService.toggleHammer();
      inventoryService.incrementGlove();
      inventoryService.toggleHookshot();
      inventoryService.toggleLantern();

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Available );
    });
  });
});
