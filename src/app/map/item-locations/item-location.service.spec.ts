import { ItemLocationService } from './item-location.service';
import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';

import { ItemLocation } from './item-location';
import { Availability } from '../availability';
import { LocationKey } from './location-key';
import { ItemKey } from '../../items/item-key';

import { Location } from '../../dungeon/location';
import { Mode } from '../../settings/mode';

describe( 'The item location service', () => {
  let itemLocationService: ItemLocationService;
  let itemService: ItemService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService());
  });
  /*
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
  */

  beforeEach( () => {
    itemService = new ItemService( settingsService );
    itemService.reset();
    dungeonService = new DungeonService();
    itemLocationService = new ItemLocationService( itemService, dungeonService, settingsService );
  });

  describe( 'set to the King\'s Tomb', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the boots and titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be made available with just the power gloves.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the gloves, a hammer, and a mirror, assuming glitches are used.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Glitches );
    });

    it( 'can cleanly be made available with gloves, hammer, mirror, and boots.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be available if you only defeated Agahnim and have the hookshot.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, a hammer, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, flippers, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(LocationKey.KingsTomb) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the Light World Swamp', () => {
    it( 'starts off as available no matter what.', () => {
      expect( itemLocationService.getAvailability(LocationKey.LightWorldSwamp) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Link\'s house', () => {
    const location = LocationKey.LinksHouse;
    const tempSettings = new SettingsService(new LocalStorageService());
    let tempService: ItemLocationService;

    describe( 'in open mode', () => {
      beforeEach( () => {
        spyOnProperty( tempSettings, 'mode', 'get').and.returnValue(Mode.Open);
        tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
      });

      it( 'starts off as available.', () => {
        expect( tempService.getAvailability( LocationKey.LinksHouse) ).toBe( Availability.Available );
        expect( tempService.getItemLocation(location).isOpened ).toBeFalsy();
      });
    });

    describe( 'in standard mode', () => {
      beforeEach( () => {
        spyOnProperty( tempSettings, 'mode', 'get').and.returnValue(Mode.Standard);
        tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
      });

      xit( 'starts off as claimed.', () => {
        expect( tempService.getAvailability( LocationKey.LinksHouse) ).toBe( Availability.Available );
        expect( tempService.getItemLocation(location).isOpened ).toBeTruthy();
      });
    });
  });

  describe( 'set to the Spiral Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'needs more than a glove to get in.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'can be gotten with glove and hookshot assuming sequence breaks are used.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Glitches);
    });

    it( 'can be gotten cleanly with the flute, mirror, and hammer.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( LocationKey.SpiralCave)).toBe( Availability.Available);
    });
  });

  describe( 'set to the Mimic Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.MimicCave) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl for a chance to get in.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the hammer too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the cane of somaria too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the magic mirror too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the power glove. The titan\'s mitts are required.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires at least one medallion to have a chance.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires a sword to utilize a medallion to get here (assuming no swordless mode).', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'can potentially be available with bombos in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with ether in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with bombos and ether in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs ether.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if ether is available but Turtle Rock needs bombos.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs quake.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is possible if bombos is available and Turtle Rock needs bombos, but no fire rod is there.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can be sequence broken into if everything except lantern and flute are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Glitches );
    });

    it( 'can be accessed normally into if everything plus the lantern are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Lantern, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave) ).toBe( Availability.Available );
    });

    it( 'can be accessed normally into if everything plus the flute are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Flute, 1);
      dungeonService.getDungeon(Location.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( LocationKey.MimicCave)  ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bonk rocks west of Sanctuary', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( LocationKey.BonkRocks ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when the boots are acquired.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
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
      itemService.setItemState(ItemKey.Bottle, 1);
      expect( itemLocationService.getAvailability( LocationKey.SickKid ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the person under the bridge', () => {
    it( 'starts off as available...with fake flippers glitching.', () => {
      expect( itemLocationService.getAvailability( LocationKey.BridgeHideout ) ).toBe( Availability.Glitches );
    });

    it( 'becomes properly available when the flippers are on hand.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( LocationKey.BridgeHideout ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the waterfall of wishing', () => {
    const location = LocationKey.WaterfallOfWishing;
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be available with sequence breaks using the moon pearl & fake flippering.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with the real flippers.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the ether tablet', () => {
    const location = LocationKey.EtherTablet;
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than a glove.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can reveal the item to you if you have a mirror, assuming you sequence broke.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can reveal the item to you if you have the hookshot and hammer.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Lantern, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the correct sword, though sequence breaks are needed with the glove and no lantern.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with the correct sword and a flute.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bombos tablet', () => {
    const location = LocationKey.BombosTablet;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs all Mirror Cave requirements to be accessible.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can state what is in the tablet without the weapon.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'is available with tablet access and a proper weapon.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the floating island', () => {
    const location = LocationKey.FloatingIsland;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove to at least see it.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove & hammer to at least see it.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be visible with the glove, hammer, and mirror...assuming you sequence broke', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be retrieved with the titan\'s mitts and moon pearl, with dark room navigation.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be retrieved properly with the titan\'s mitts, lantern and moon pearl.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to King Zora himself', () => {
    const location = LocationKey.KingZora;

    it( 'is available through sequence breaks at the start.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with a glove.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the old man to be rescued', () => {
    const location = LocationKey.LostOldMan;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute, though as a sequence break without the lantern.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can properly be gotten with a glove and a lantern.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the potion shop', () => {
    const location = LocationKey.PotionShop;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if the mushroom is given.', () => {
      itemService.setItemState(ItemKey.Mushroom, 1);

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
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the mad batter\'s home', () => {
    const location = LocationKey.MadBatter;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the hammer to access.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs is accessible (through glitches) with the mushroom.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mushroom, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'needs is accessible legitmately with the powder.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Powder, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the spectacle rock cave', () => {
    const location = LocationKey.SpectacleRockCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute by itself.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with a glove, but requires dark room navigation without the lantern.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the dwarf turned into the frog', () => {
    const location = LocationKey.DwarfEscort;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs both the moon pearl and titan\'s mitts to access.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the graveyard cliff', () => {
    const location = LocationKey.GraveyardCliffCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be accessed with access to the village of outcasts and a mirror.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the top of spectacle rock', () => {
    const location = LocationKey.SpectacleRock;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is visible as soon as a glove is on hand.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be gotten with a mirror, though it involves a sequence break.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with a flute.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the checkerboard cave above the desert', () => {
    const location = LocationKey.CheckerboardCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs the mitts, flute, and mirror to get in.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the library', () => {
    const location = LocationKey.Library;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'requires the boots to grab.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the west ledge of the desert', () => {
    const location = LocationKey.DesertWestLedge;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the flute and titan\'s mitt.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the small island on Lake Hylia', () => {
    const location = LocationKey.LakeHyliaIsland;

    it( 'starts off as visible (assuming you jump down).', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'requires the flippers to at least be visible (normally).', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers and moon pearl.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers, moon pearl, and mirror.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be retrieved with the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be retrieved with any glove along with the hammer.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the zora ledge below the king', () => {
    const location = LocationKey.ZoraLedge;

    it( 'starts off as visible, assuming you can fake flipper.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be grabbed with the flippers.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'is visible normally if just a glove is on hand.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });
  });

  describe( 'set to the buried item in the grove', () => {
    const location = LocationKey.BuriedItem;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is available when the shovel is acquired.', () => {
      itemService.setItemState(ItemKey.Shovel, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the three chests in the side of the escape', () => {
    const location = LocationKey.SewerEscapeSideRoom;
    const tempSettings = new SettingsService(new LocalStorageService());
    let tempService: ItemLocationService;

    beforeEach( () => {
      spyOnProperty(tempSettings, 'mode', 'get').and.returnValue(Mode.Open);
      tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
    });

    it( 'starts off as available through skipping the lantern.', () => {
      expect( tempService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is possible to get with the lantern alone, though it is dependant on key locations.', () => {
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( tempService.getAvailability( location ) ).toBe( Availability.Possible );
    });

    it( 'is definitely available if a glove is owned.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( tempService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the lone chest in the dark of the sewer escape', () => {
    const location = LocationKey.SewerEscapeDarkRoom;
    const tempSettings = new SettingsService(new LocalStorageService());
    let tempService: ItemLocationService;

    beforeEach( () => {
      spyOnProperty(tempSettings, 'mode', 'get').and.returnValue(Mode.Open);
      tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
    });

    it( 'starts off as available through skipping the lantern.', () => {
      expect( tempService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is normally available when the lantern is acquired.', () => {
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( tempService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the master sword pedestal', () => {
    const location = LocationKey.MasterSwordPedestal;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can tell you the item if you have the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be available if you defeat all of the bosses.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the misery mire hut', () => {
    const location = LocationKey.MireHut;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the flute.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the titan mitts as well.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the moon pearl.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the mirror if you can pull off the super bunny glitch.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the treasure minigame at the Village of Outcasts', () => {
    const location = LocationKey.TreasureChestMinigame;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with outcast access.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the super bunny cave in Dark Death Mountain', () => {
    const location = LocationKey.SuperBunnyCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the power glove.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan mitts.', () => {
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is potentially available with the hookshot, though super bunny status is needed.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is potentially available with the mirror and hammer, though super bunny status is needed.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with the flute and moon pearl.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the byrna spike cave', () => {
    const location = LocationKey.SpikeCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the glove for the end.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the hammer for the beginning.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl for the beginning.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the cane of byrna itself, though the old man cave is still a sequence break.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Byrna, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten with the cape itself (plus the flute).', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Cape, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'is possible to get with one bottle of healing potion, assuming that is the contents.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Bottle, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Possible );
    });
  });

  describe( 'set to the HYPE cave', () => {
    const location = LocationKey.HypeCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be gotten through the outcast route.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten through the Agahnim route.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bottom chest of hookshot cave', () => {
    const location = LocationKey.HookshotCaveBottom;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the hookshot, assuming the DM logic is broken.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten with the boots.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the top three chests of hookshot cave', () => {
    const location = LocationKey.HookshotCaveTop;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is gotten with the hookshot and flute.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the boots and northern path assuming you can hover.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the purple chest', () => {
    const location = LocationKey.PurpleChest;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the dwarf being returned home first.', () => {
      const dwarf = itemLocationService.getItemLocation( LocationKey.DwarfEscort );
      dwarf.toggleOpened();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the catfish', () => {
    const location = LocationKey.Catfish;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl & glove.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be gotten with Agahnim\'s death.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      dungeonService.agahnimTower.toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten with a hammer.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten with swimming and stronger miits.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the hammer peg cave', () => {
    const location = LocationKey.HammerPegCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can only be gotten with the HAMMER!', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bumper cave', () => {
    const location = LocationKey.BumperCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires outcast access to see the item.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the cape.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Cape, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the pyramid ledge', () => {
    const location = LocationKey.Pyramid;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with Agahnim\'s defeat.', () => {
      dungeonService.agahnimTower.toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the glove, hammer, and moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the mitts, flippers, and moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the fairy inside of the pyramid', () => {
    const location = LocationKey.PyramidFairy;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the dungeons with the fairy crystals beaten, though more is still necessary.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the moon pearl, though still more is needed.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with Agahnim\'s demise and a hammer.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });
});
