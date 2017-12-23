import { DungeonLocationService } from './dungeon-location.service';
import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';

import { DungeonLocation } from './dungeon-location';
import { Availability } from '../availability';

import { Location } from '../../dungeon/location';
import { Mode } from '../../settings/mode';
import { ItemKey } from '../../items/item-key';

describe( 'The dungeon location service', () => {
  let dungeonLocationService: DungeonLocationService;
  let itemService: ItemService;
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
    itemService = new ItemService( settingsService );
    itemService.reset();
    dungeonService = new DungeonService();
    dungeonService.reset();
    dungeonLocationService = new DungeonLocationService( itemService, dungeonService, settingsService );
    dungeonLocationService.reset();
  });

  describe( 'set to Agahnim\'s Tower', () => {
    const location = Location.CastleTower;

    describe( 'with a sword available', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'can be made available with the master sword, with a sequence break.', () => {
        itemService.getItem(ItemKey.Sword).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be made available with the master sword and the lantern.', () => {
        itemService.getItem(ItemKey.Sword).state = 2;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Available );
      });
    });

    describe( 'in swordless mode', () => {
      const tempSettings = new SettingsService(new LocalStorageService());
      let tempService: DungeonLocationService;

      beforeEach( () => {
        spyOnProperty(tempSettings, 'mode', 'get').and.returnValue(Mode.Swordless);
        tempService = new DungeonLocationService( itemService, dungeonService, tempSettings );
      });

      it( 'starts off as unavailable.', () => {
        expect( tempService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'is still unavailable if you can get in with a cape.', () => {
        itemService.getItem(ItemKey.Cape).state = 1;

        expect( tempService.getChestAvailability(location)).toBe( Availability.Unavailable );
      });

      it( 'can be beaten with the net, though is tricky without the lamp.', () => {
        itemService.getItem(ItemKey.Cape).state = 1;
        itemService.getItem(ItemKey.Net).state = 1;

        expect( tempService.getChestAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be beaten cleanly with the net and lantern.', () => {
        itemService.getItem(ItemKey.Cape).state = 1;
        itemService.getItem(ItemKey.Net).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

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
        itemService.getItem(ItemKey.Bow).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Glitches );
      });

      it( 'can be beaten easily with the bow and lantern.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

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
        itemService.getItem(ItemKey.Lantern).state = 1;

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
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires the book and glove to get into the doorway, with the boss still unavailable.', () => {
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Book).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can be beaten with the fire rod, assuming boots were not required to get in.', () => {
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Flute).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can be beaten with the fire rod cleanly if the boots were retrieved beforehand.', () => {
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Flute).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Boots).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'requires entry into the dungeon first.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can be fully raided with a glove, fire source, and boots.', () => {
        itemService.getItem(ItemKey.Book).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Boots).state = 1;
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is possible to raid with just the book, though it depends on luck.', () => {
        itemService.getItem(ItemKey.Book).state = 1;
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'may appear doable if you only have the boots and both items to find.', () => {
        itemService.getItem(ItemKey.Book).state = 1;
        itemService.getItem(ItemKey.Boots).state = 1;
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
      itemService.getItem(ItemKey.Hammer).state = 1;

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
    });

    it( 'requires access to death mountain to think about entering.', () => {
      itemService.getItem(ItemKey.Hammer).state = 1;
      itemService.getItem(ItemKey.Glove).state = 1;

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Unavailable );
    });

    it( 'is potentially completable if you are missing a fire source.', () => {
      itemService.getItem(ItemKey.Hammer).state = 1;
      itemService.getItem(ItemKey.Glove).state = 1;
      itemService.getItem(ItemKey.Mirror).state = 1;

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Possible );
    });

    it( 'can be beaten with the fire rod for lighting torches, but the caves must be navigated in the dark first.', () => {
      itemService.getItem(ItemKey.Hammer).state = 1;
      itemService.getItem(ItemKey.Glove).state = 1;
      itemService.getItem(ItemKey.Mirror).state = 1;
      itemService.getItem(ItemKey.FireRod).state = 1;

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Glitches );
    });

    it( 'can be beaten with the lantern for lighting torches, allowing the cave entrance to be lit.', () => {
      itemService.getItem(ItemKey.Hammer).state = 1;
      itemService.getItem(ItemKey.Glove).state = 1;
      itemService.getItem(ItemKey.Hookshot).state = 1;
      itemService.getItem(ItemKey.Lantern).state = 1;

      expect( dungeonLocationService.getBossAvailability(location)).toBe( Availability.Available );
    });
  });

  describe( 'set to the Palace of Darkness', () => {
    const location = Location.PalaceOfDarkness;

    describe( '-- the boss --', () => {
      it( 'cannot be beaten with no items.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the bow to open the way.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer to pound the turtles.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs a glove to get in and finish the job, albiet with dark room navigation.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'needs a lantern for a legit kill.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'cannot be robbed at the start of the game.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer to get in.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the powered gloves to get in.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can maybe get everything with the hammer and glove.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can maybe get everything if not hammer locked on the boss.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;
        const dungeon = dungeonService.getDungeon(location);

        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can definitely get everything with the bow and lantern.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });
    });
  });

  describe( 'set to the Swamp Palace', () => {
    const location = Location.SwampPalace;

    describe( '-- the boss --', () => {
      it( 'is not assailable at the start.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the mirror.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hookshot.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is available with a glove.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as not raidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the mirror.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the flippers.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be fully raidable with the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'should be fully raidable with the titan\'s mitts and hammer.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is no longer fully raidable if the first chest does not have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is now fully raidable if the first chest does have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is not fully raidable if the first two chests do not have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is potentially fully raidable if the first two chests do not have a hookshot.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'is now fully raidable if the first two chests have a hookshot and hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'requires the hookshot and hammer for the last two chests.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is fully raidable with the hookshot and hammer assuming there are only two chests left.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Mirror).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });
    });
  });

  describe('set to the Skull Woods', () => {
    const location = Location.SkullWoods;

    describe('-- the boss --', () => {
      it( 'cannot be beaten right away.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than outcast access.', () => {
        dungeonService.getDungeon(Location.CastleTower).toggleDefeat();
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the fire rod assuming a non swordless mode.', () => {
        dungeonService.getDungeon(Location.CastleTower).toggleDefeat();
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the sword to cut the curtains assuming a non swordless mode.', () => {
        dungeonService.getDungeon(Location.CastleTower).toggleDefeat();
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as unraidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible to get all of the chests without the fire rod.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'is fully raidable with the fire rod.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });
    });
  });

  describe( 'set to the thieves town dungeon', () => {
    const location = Location.ThievesTown;

    describe( '-- the boss --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than a weapon to take out Blind.', () => {
        itemService.getItem(ItemKey.Byrna).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires outcast access to actually finish the job.', () => {
        itemService.getItem(ItemKey.Byrna).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unraidable', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is theoretically clearable just by getting there.', () => {
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'becomes restricted to possible if down to one chest without the hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });
    });
  });

  describe( 'set to the ice palace', () => {
    const location = Location.IcePalace;

    describe( '-- the boss --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible, with bomb jumping, assuming bombos is on hand.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is possible, with bombos and hookshot is on hand.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unraidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible, with bomb jumping, assuming bombos is on hand.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is fully possible with bombos and hammer on hand.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Flippers).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });
    });
  });

  describe( 'set to misery mire', () => {
    const location = Location.MiseryMire;

    describe('-- the boss --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the bow.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires the medallions (and sword) to possibly finish the job.', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'requires a fire source to finish the job...with a dark room', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is better to use the lantern to finish the job', () => {
        itemService.getItem(ItemKey.Bow).state = 1;
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl and titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'becomes possible with the medallions.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'becomes guaranteed with a lantern on hand.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'may require the cane of somaria if Vitreous has the second item.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;
        dungeonService.getDungeon(location).decrementChestCount();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });
    });
  });

  describe( 'set to turtle rock', () => {
    const location = Location.TurtleRock;

    describe( '-- the boss --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hammer.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the ice rod.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the fire rod.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be possible with the medallions at the risk of safety.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can be done with the cape, but it requires dark room navigation.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Cape).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'can be done with the cane of byrna and the lantern without breaks.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;
        itemService.getItem(ItemKey.Byrna).state = 1;
        itemService.getItem(ItemKey.Lantern).state = 1;

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hammer.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be possible with the medallions at the risk of safety.', () => {
        itemService.getItem(ItemKey.MoonPearl).state = 1;
        itemService.getItem(ItemKey.Hammer).state = 1;
        itemService.getItem(ItemKey.Glove).state = 2;
        itemService.getItem(ItemKey.Somaria).state = 1;
        itemService.getItem(ItemKey.Hookshot).state = 1;
        itemService.getItem(ItemKey.IceRod).state = 1;
        itemService.getItem(ItemKey.FireRod).state = 1;
        itemService.getItem(ItemKey.Bombos).state = 1;
        itemService.getItem(ItemKey.Ether).state = 1;
        itemService.getItem(ItemKey.Quake).state = 1;
        itemService.getItem(ItemKey.Sword).state = 1;

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });
    });
  });
});
