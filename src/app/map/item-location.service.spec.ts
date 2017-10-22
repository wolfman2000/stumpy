import { ItemLocationService } from './item-location.service';
import { InventoryService } from '../inventory.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { ItemLocation } from './item-location';
import { Availability } from './availability';
import { LocationKey } from './location-key';

import { Location } from '../dungeon/location';
import { Mode } from '../settings/mode';

describe( 'The item location service', () => {
  let itemLocationService: ItemLocationService;
  let inventoryService: InventoryService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService());
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
    itemLocationService = new ItemLocationService( inventoryService, dungeonService, settingsService );
  });

  describe( 'set to the King\'s Tomb', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the pearl and titan\'s mitts.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be made available with just the power gloves.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the gloves, a hammer, and a mirror, assuming glitches are used.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Glitches );
    });

    it( 'can cleanly be made available with gloves, hammer, mirror, and boots.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be available if you only defeated Agahnim and have the hookshot.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHookshot();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, a hammer, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleHookshot();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, flippers, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleHookshot();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleFlippers();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the Light World Swamp', () => {
    it( 'starts off as available no matter what.', () => {
      expect( itemLocationService.getAvailability(LocationKey.LightWorldSwamp) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Link\'s house', () => {
    let home: ItemLocation;

    it( 'starts off as available in open mode.', () => {
      settingsService.mode = Mode.Open;
      const tempLocationService = new ItemLocationService(inventoryService, dungeonService, settingsService);
      home = tempLocationService.getItemLocation(LocationKey.LinksHouse);

      expect( tempLocationService.getAvailability( LocationKey.LinksHouse) ).toBe( Availability.Available );
      expect( home.isOpened ).toBeFalsy();
    });

    xit( 'starts off as claimed in standard mode.', () => {
      settingsService.mode = Mode.Standard;
      const tempLocationService = new ItemLocationService(inventoryService, dungeonService, settingsService);
      home = tempLocationService.getItemLocation(LocationKey.LinksHouse);

      expect( tempLocationService.getAvailability( LocationKey.LinksHouse) ).toBe( Availability.Available );
      expect ( home.isOpened ).toBeTruthy();
    });
  });

  describe( 'set to the Spiral Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'needs more than a glove to get in.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'can be gotten with glove and hookshot assuming sequence breaks are used.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleHookshot();

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Glitches);
    });

    it( 'can be gotten cleanly with the flute, mirror, and hammer.', () => {
      inventoryService.toggleFlute();
      inventoryService.toggleMirror();
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Available);
    });
  });

  describe( 'set to the Mimic Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.MimicCave) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl for a chance to get in.', () => {
      inventoryService.toggleMoonPearl();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the hammer too.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the cane of somaria too.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the magic mirror too.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the power glove. The titan\'s mitts are required.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires at least one medallion to have a chance.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires a sword to utilize a medallion to get here (assuming no swordless mode).', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'can potentially be available with bombos in hand if no dungeon medallion info is available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with ether in hand if no dungeon medallion info is available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleEther();
      inventoryService.incrementSword();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with bombos and ether in hand if no dungeon medallion info is available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.toggleEther();
      inventoryService.incrementSword();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs ether.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if ether is available but Turtle Rock needs bombos.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleEther();
      inventoryService.incrementSword();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs quake.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is possible if bombos is available and Turtle Rock needs bombos, but no fire rod is there.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can be sequence broken into if everything except lantern and flute are available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      inventoryService.toggleFireRod();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Glitches );
    });

    it( 'can be accessed normally into if everything plus the lantern are available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      inventoryService.toggleFireRod();
      inventoryService.toggleLantern();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave) ).toBe( Availability.Available );
    });

    it( 'can be accessed normally into if everything plus the flute are available.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleSomaria();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleBombos();
      inventoryService.incrementSword();
      inventoryService.toggleFireRod();
      inventoryService.toggleFlute();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Available );
    });
  });
});
