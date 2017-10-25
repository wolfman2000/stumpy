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

  describe( 'set to the bonk rocks west of Sanctuary', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.BonkRocks ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when the boots are acquired.', () => {
      inventoryService.toggleBoots();
      expect( itemLocationService.getAvailability( LocationKey.BonkRocks ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Sahasrahla himself', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.SahasrahlasReward ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when the one boss with the green pendant is defeated.', () => {
      // TODO: Random number this.
      const dungeonId = 3;
      const dungeon = dungeonService.getDungeon( dungeonId );
      dungeon.toggleDefeat();
      dungeon.cycleReward();

      expect( itemLocationService.getAvailability( LocationKey.SahasrahlasReward ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the sick kid\'s house', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.SickKid ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when one bottle is acquired.', () => {
      inventoryService.incrementBottles();
      expect( itemLocationService.getAvailability( LocationKey.SickKid ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the person under the bridge', () => {
    it( 'starts off as available...with fake flippers glitching.', () => {
      expect( itemLocationService.getAvailability( LocationKey.BridgeHideout ) ).toBe( Availability.Glitches );
    });

    it( 'becomes properly available when the flippers are on hand.', () => {
      inventoryService.toggleFlippers();

      expect( itemLocationService.getAvailability( LocationKey.BridgeHideout ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the ether tablet', () => {
    const location = LocationKey.EtherTablet;
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the book.', () => {
      inventoryService.toggleBook();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than a glove.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can reveal the item to you if you have a mirror.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can reveal the item to you if you have the hookshot and hammer.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleHookshot();
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the correct sword, though sequence breaks are needed with the glove and no lantern.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();
      inventoryService.incrementSword();
      inventoryService.incrementSword();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with the correct sword and a flute.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();
      inventoryService.incrementSword();
      inventoryService.incrementSword();
      inventoryService.toggleFlute();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bombos tablet', () => {
    const location = LocationKey.BombosTablet;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs all Mirror Cave requirements to be accessible.', () => {
      inventoryService.toggleBook();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can state what is in the tablet without the weapon.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'is available with tablet access and a proper weapon.', () => {
      inventoryService.toggleBook();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleMirror();
      inventoryService.incrementSword();
      inventoryService.incrementSword();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the floating island', () => {
    const location = LocationKey.FloatingIsland;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove to at least see it.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove & hammer to at least see it.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be visible with the glove, hammer, and mirror.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be retrieved with the titan\'s mitts and moon pearl, with dark room navigation.', () => {
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleMoonPearl();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be retrieved properly with the titan\'s mitts, lantern and moon pearl.', () => {
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleLantern();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to King Zora himself', () => {
    const location = LocationKey.KingZora;

    it( 'is available through sequence breaks at the start.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with a glove.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the old man to be rescued', () => {
    const location = LocationKey.LostOldMan;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute, though as a sequence break without the lantern.', () => {
      inventoryService.toggleFlute();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can properly be gotten with a glove and a lantern.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleLantern();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the potion shop', () => {
    const location = LocationKey.PotionShop;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if the mushroom is given.', () => {
      inventoryService.toggleMushroom();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the lumberjack cave', () => {
    const location = LocationKey.LumberjackTree;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than Agahnim to be defeated.', () => {
      dungeonService.agahnimTower.toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'also needs the boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleBoots();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the mad batter\'s home', () => {
    const location = LocationKey.MadBatter;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the hammer to access.', () => {
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs is accessible (through glitches) with the mushroom.', () => {
      inventoryService.toggleHammer();
      inventoryService.toggleMushroom();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'needs is accessible legitmately with the powder.', () => {
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();
      inventoryService.toggleMoonPearl();
      inventoryService.togglePowder();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the spectacle rock cave', () => {
    const location = LocationKey.SpectacleRockCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute by itself.', () => {
      inventoryService.toggleFlute();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with a glove, but requires dark room navigation without the lantern.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the dwarf turned into the frog', () => {
    const location = LocationKey.DwarfEscort;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs both the moon pearl and titan\'s mitts to access.', () => {
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleMoonPearl();
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the graveyard cliff', () => {
    const location = LocationKey.GraveyardCliffCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be accessed with access to the village of outcasts and a mirror.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleMoonPearl();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the top of spectacle rock', () => {
    const location = LocationKey.SpectacleRock;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is visible as soon as a glove is on hand.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with a mirror, though it involves a sequence break.', () => {
      inventoryService.incrementGlove();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with a flute.', () => {
      inventoryService.toggleFlute();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the checkerboard cave above the desert', () => {
    const location = LocationKey.CheckerboardCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs the mitts, flute, and mirror to get in.', () => {
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();
      inventoryService.toggleFlute();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the library', () => {
    const location = LocationKey.Library;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'requires the boots to grab.', () => {
      inventoryService.toggleBoots();
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the west ledge of the desert', () => {
    const location = LocationKey.DesertWestLedge;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the book.', () => {
      inventoryService.toggleBook();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the flute and titan\'s mitt.', () => {
      inventoryService.toggleFlute();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the small island on Lake Hylia', () => {
    const location = LocationKey.LakeHyliaIsland;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the flippers to at least be visible.', () => {
      inventoryService.toggleFlippers();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers and moon pearl.', () => {
      inventoryService.toggleFlippers();
      inventoryService.toggleMoonPearl();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers, moon pearl, and mirror.', () => {
      inventoryService.toggleFlippers();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleMirror();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be retrieved with the titan\'s mitts.', () => {
      inventoryService.toggleFlippers();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be retrieved with any glove along with the hammer.', () => {
      inventoryService.toggleFlippers();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleMirror();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the zora ledge below the king', () => {
    const location = LocationKey.ZoraLedge;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be grabbed with the flippers.', () => {
      inventoryService.toggleFlippers();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'is visible if just a glove is on hand.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });
  });

  describe( 'set to the buried item in the grove', () => {
    const location = LocationKey.BuriedItem;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is available when the shovel is acquired.', () => {
      inventoryService.toggleShovel();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the three chests in the side of the escape', () => {
    const location = LocationKey.SewerEscapeSideRoom;

    it( 'starts off as available through skipping the lantern.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is possible to get with the lantern alone, though it is dependant on key locations.', () => {
      inventoryService.toggleLantern();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Possible );
    });

    it( 'is definitely available if a glove is owned.', () => {
      inventoryService.incrementGlove();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the lone chest in the dark of the sewer escape', () => {
    const location = LocationKey.SewerEscapeDarkRoom;

    it( 'starts off as available through skipping the lantern.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is normally available when the lantern is acquired.', () => {
      inventoryService.toggleLantern();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the master sword pedestal', () => {
    const location = LocationKey.MasterSwordPedestal;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can tell you the item if you have the book.', () => {
      inventoryService.toggleBook();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be available if you defeat all of the bosses.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });
});
