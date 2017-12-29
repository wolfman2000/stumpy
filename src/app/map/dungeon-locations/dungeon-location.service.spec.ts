import { DungeonLocationService } from './dungeon-location.service';
import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';
import { BossService } from '../../boss/boss.service';

import { WordSpacingPipe } from '../../word-spacing.pipe';

import { DungeonLocation } from './dungeon-location';
import { Availability } from '../availability';

import { Location } from '../../dungeon/location';
import { ItemKey } from '../../items/item-key';

import { ItemShuffle } from '../../settings/item-shuffle';
import { Mode } from '../../settings/mode';
import { settings } from 'cluster';

describe( 'The dungeon location service', () => {
  let dungeonLocationService: DungeonLocationService;
  let itemService: ItemService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;
  let bossService: BossService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Standard );
  });

  function reset() {
    itemService = new ItemService( settingsService );
    itemService.reset();
    dungeonService = new DungeonService();
    dungeonService.reset();
    bossService = new BossService( settingsService, itemService );
    dungeonLocationService = new DungeonLocationService( itemService, dungeonService, settingsService, bossService );
    dungeonLocationService.reset();
  }

  beforeEach( reset );

  function checkChestAvailability( location: Location, availability: Availability ) {
    expect( dungeonLocationService.getChestAvailability(location)).toBe(availability);
  }

  function checkBossAvailability( location: Location, availability: Availability ) {
    expect( dungeonLocationService.getBossAvailability(location)).toBe(availability);
  }

  describe( 'using normal item shuffling logic', () => {

    beforeEach( () => {
      spyOnProperty( settingsService, 'itemShuffle', 'get').and.returnValue( ItemShuffle.Normal );
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
        const tempSettings = new SettingsService(new LocalStorageService(), new WordSpacingPipe() );
        let tempService: DungeonLocationService;

        beforeEach( () => {
          spyOnProperty(tempSettings, 'mode', 'get').and.returnValue(Mode.Swordless);
          tempService = new DungeonLocationService( itemService, dungeonService, tempSettings, bossService );
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
          dungeonService.getDungeon(location).decrementItemChestCount();

          expect( dungeonLocationService.getChestAvailability(location)).toBe( Availability.Possible );
        });

        it( 'may be possible, may not be if one chest is left and the bow is not on hand.', () => {
          dungeonService.getDungeon(location).decrementItemChestCount();
          dungeonService.getDungeon(location).decrementItemChestCount();
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

          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

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
          dungeon.decrementItemChestCount();

          itemService.getItem(ItemKey.MoonPearl).state = 1;
          itemService.getItem(ItemKey.Mirror).state = 1;
          itemService.getItem(ItemKey.Flippers).state = 1;
          itemService.getItem(ItemKey.Glove).state = 2;

          expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
        });

        it( 'is now fully raidable if the first chest does have a hammer.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementItemChestCount();

          itemService.getItem(ItemKey.MoonPearl).state = 1;
          itemService.getItem(ItemKey.Mirror).state = 1;
          itemService.getItem(ItemKey.Flippers).state = 1;
          itemService.getItem(ItemKey.Glove).state = 2;
          itemService.getItem(ItemKey.Hammer).state = 1;

          expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
        });

        it( 'is not fully raidable if the first two chests do not have a hammer.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

          itemService.getItem(ItemKey.MoonPearl).state = 1;
          itemService.getItem(ItemKey.Mirror).state = 1;
          itemService.getItem(ItemKey.Flippers).state = 1;
          itemService.getItem(ItemKey.Glove).state = 2;

          expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
        });

        it( 'is potentially fully raidable if the first two chests do not have a hookshot.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

          itemService.getItem(ItemKey.MoonPearl).state = 1;
          itemService.getItem(ItemKey.Mirror).state = 1;
          itemService.getItem(ItemKey.Flippers).state = 1;
          itemService.getItem(ItemKey.Glove).state = 2;
          itemService.getItem(ItemKey.Hammer).state = 1;

          expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
        });

        it( 'is now fully raidable if the first two chests have a hookshot and hammer.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

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
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

          itemService.getItem(ItemKey.MoonPearl).state = 1;
          itemService.getItem(ItemKey.Mirror).state = 1;
          itemService.getItem(ItemKey.Flippers).state = 1;
          itemService.getItem(ItemKey.Glove).state = 2;

          expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
        });

        it( 'is fully raidable with the hookshot and hammer assuming there are only two chests left.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

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
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();
          dungeon.decrementItemChestCount();

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
          dungeonService.getDungeon(location).decrementItemChestCount();

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

  describe( 'using the keysanity logic', () => {
    beforeEach( () => {
      spyOnProperty( settingsService, 'itemShuffle', 'get').and.returnValue( ItemShuffle.Keysanity );
    });

    describe( 'set to the castle tower ', () => {
      const location = Location.CastleTower;

      describe( '-- the boss --', () => {
        it( 'starts off as unavailable.', () => {
          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'requires more than being able to enter the building and defeat Agahnim.', () => {
          itemService.setItemState(ItemKey.Sword, 2);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'takes two small keys to reach the top of the tower.', () => {
          const dungeon = dungeonService.getDungeon(location);
          itemService.setItemState(ItemKey.Sword, 2);
          itemService.setItemState(ItemKey.Lantern, 1);

          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();

          checkBossAvailability(location, Availability.Available);
        });
      } );

      describe( '-- the chests --', () => {
        it( 'cannot be raided at the start due to lack of equipment.', () => {
          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'requires a cape (or master sword) to at least get one chest.', () => {
          itemService.setItemState(ItemKey.Cape, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'requires a small key as well to get the second chest, albiet in the dark.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Sword, 2);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'requires a small key & a lantern to get the second chest in the light.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Sword, 2);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Available);
        });
      } );
    });

    describe( 'set to the eastern palace', () => {
      const location = Location.EasternPalace;

      describe( '-- the boss --', () => {
        it( 'cannot be beaten without the big key on hand.', () => {
          checkBossAvailability(location, Availability.Unavailable);
        });
      });

      describe( '-- the chests --', () => {
        it( 'starts off as possible to get everything with no inventory.', () => {
          checkChestAvailability(location, Availability.Possible);
        });

        it( 'requires dark room navigation to finish, if lucky, if three chests are raided.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can potentially be finished if three chests are raided & the lamp is on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'requires dark room navigation to finish, if lucky, if four chests are raided & the big key is on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can potentially be finished if four chests are raided & both the lamp and big key are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can be raided fully, with dark rooms, if the bow & big key are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Bow, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can be raided fully if the bow, lantern, & big key are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Available);
        });

        it( 'is impossible to raid fully if down to one chest and ill equipped.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();

          checkChestAvailability(location, Availability.Unavailable);
        });
      });
    });

    describe( 'set to the desert palace', () => {
      const location = Location.DesertPalace;

      describe( '-- the boss --', () => {
        it( 'cannot be beaten without the big key on hand.', () => {
          checkBossAvailability(location, Availability.Unavailable);
        });
      });

      describe( '-- the chests --', () => {
        it( 'cannot be raided without first being able to enter.', () => {
          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'can potentially be raided from the beginning if access is available.', () => {
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Mirror, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'cannot be raided if the first chest turns up empty or stuff was not brought from outside.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is possible to open a second chest with the boots as well.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Boots, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to open a third chest with a fire source and big key.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to open a third chest with the big key and boots.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Boots, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to open a fourth chest with one small key and the boots.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Boots, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to open a fourth chest with the big key, a fire source, and the boots.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Boots, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to open a fifth chest with both keys, glove, and fire source.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Glove, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can be fully raided with both keys, glove, fire source, and boots.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Book, 1);
          itemService.setItemState(ItemKey.Glove, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Boots, 1);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });

    describe( 'set to the tower of hera', () => {
      const location = Location.TowerOfHera;

      describe( '-- the boss --', () => {
        it( 'requires more than a sword to get up to the tower.', () => {
          itemService.setItemState(ItemKey.Sword, 3);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'requires a flute to get to the portal...which is not the tower.', () => {
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Flute, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'requires the flute, hookshot, and hammer to get up to the tower.', () => {
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkBossAvailability(location, Availability.Available);
        });

        it( 'requires the glove, hookshot, and hammer to get up to the tower assuming dark room navigation.', () => {
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkBossAvailability(location, Availability.Glitches);
        });
      });

      describe( '-- the chests --', () => {
        it( 'requires access to the tower first.', () => {
          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'requires more than the glove to get into the front door.', () => {
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'can potentially be raided at the start, though a sequence break was done to get up in the first place.', () => {
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Mirror, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can potentially (and logically) be raided at the start.', () => {
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Mirror, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can get a third chest to continue with basement access, even without the lantern.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can get a third chest to continue with basement access logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can get a fourth chest with the big key, illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can get a fourth chest with the big key, logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can get a fifth chest with the big key and basement access, illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can get a fifth chest with the big key and basement access, logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'becomes stuck if two chests left and no way to access the basement or top.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Mirror, 1);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'can be fully completed with both keys and a melee weapon, illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Glove, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'can be fully completed with both keys and a melee weapon, logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Flute, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });

    describe( 'set to the palace of darkness', () => {
      const location = Location.PalaceOfDarkness;

      describe( '-- the boss --', () => {
        it( 'requires more than standard equipment to get through.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'can potentially be done if the big key and at least one small key is on hand, illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 1);

          checkBossAvailability(location, Availability.Glitches);
        });

        it( 'can potentially be done if the big key and at least one small key is on hand, logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Possible);
        });

        it( 'can definitely be done with all keys.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Available);
        });
      });

      describe( '-- the chests --', () => {
        it( 'requires huge luck at the start to get everything with the bare minimum.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with a bow at the start.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Bow, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with a key at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with two keys at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with three keys at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with four keys at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can have more chests gotten with five keys at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'becomes a dead end if stuck with unreachable chests via logic.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'can have more chests gotten with five keys, the bow, & the big key at the start.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Bow, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'may be possible to get the remaining three if keys are used in a strange order, illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Bow, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'may be possible to get the remaining three if keys are used in a strange order, logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is fully raidable if fully equipped.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Bow, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Available);
        })
      });
    });

    describe( 'set to the swamp palace', () => {
      const location = Location.SwampPalace;

      describe('-- the boss --', () => {
        it( 'requires a small key in order to enter.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkBossAvailability(location, Availability.Unavailable);
        });
      });

      describe( '-- the chests --', () => {
        it( 'starts off as possible to get everything, though of course luck is needed.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'becomes impossible to progress if the small key is not found in the first chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is still possible to progress if the small key is found in the first chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is still possible to progress if the hammer is found by the fourth chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is still possible to progress if the big key is found by the fifth chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is still possible to progress if the hookshot is found by the eighth chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is fully raidable with both keys, hammer, and hookshot equipped.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Mirror, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });

    describe( 'set to the skull woods chests', () => {
      const location = Location.SkullWoods;

      it( 'is possible to get everything at the start, assuming the place is reached.', () => {
        itemService.setItemState(ItemKey.MoonPearl, 1);
        itemService.setItemState(ItemKey.Glove, 2);

        checkChestAvailability(location, Availability.Possible);
      });

      it( 'becomes impossible to go through if down to three chests without any progress.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        itemService.setItemState(ItemKey.MoonPearl, 1);
        itemService.setItemState(ItemKey.Glove, 2);

        checkChestAvailability(location, Availability.Unavailable);
      });

      it( 'can be salvaged if the fire rod is on hand with three chests to go.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        itemService.setItemState(ItemKey.MoonPearl, 1);
        itemService.setItemState(ItemKey.Glove, 2);
        itemService.setItemState(ItemKey.FireRod, 1);

        checkChestAvailability(location, Availability.Possible);
      });

      it( 'can be salvaged if the fire rod & big key are on hand with two chests to go.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.toggleBigKey();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        dungeon.decrementTotalChestCount();
        itemService.setItemState(ItemKey.MoonPearl, 1);
        itemService.setItemState(ItemKey.Glove, 2);
        itemService.setItemState(ItemKey.FireRod, 1);

        checkChestAvailability(location, Availability.Possible);
      });

      it( 'is fully raidable with the big key, fire rod, and sword.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.toggleBigKey();
        itemService.setItemState(ItemKey.MoonPearl, 1);
        itemService.setItemState(ItemKey.Glove, 2);
        itemService.setItemState(ItemKey.FireRod, 1);
        itemService.setItemState(ItemKey.Sword, 3);

        checkChestAvailability(location, Availability.Available);
      });
    });

    describe( 'set to the theives town', () => {
      const location = Location.ThievesTown;

      describe( '-- the boss --', () => {
        it( 'is not possible to reach unless the big key is on hand.', () => {
          itemService.setItemState(ItemKey.Sword, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkBossAvailability(location, Availability.Unavailable);
        });
      });

      describe( '-- the chests --', () => {
        it( 'is possible to raid if one gets lucky on the 4th chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Sword, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is impossible to raid if one gets unlucky on the 4th chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Sword, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is possible to raid if one has the big key by the 4th chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Sword, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid if one has the big key and a cane by the 6th chest.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can be fully raided with big key, small key, and hammer specifically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });

    describe( 'set to the ice palace', () => {
      const location = Location.IcePalace;

      describe('-- the boss --', () => {
        it( 'can maybe be reached if lucky at the start.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);

          checkBossAvailability(location, Availability.Possible);
        });

        it( 'can definitely be reached if a key and cane of somaria are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Somaria, 1);

          checkBossAvailability(location, Availability.Available);
        });
      });

      describe('-- the chests --', () => {
        it( 'is possible to get the first few chests no problem at least.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is impossible to raid if down to four chests without progress.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is possible to raid if the big key is on hand with four chests left.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid if down to two chests and equipped with the hammer.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to get everything with both big key and hammer, though keys are an issue.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Hammer, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is fully raidable with big key, hammer, one small key, and the cane of somaria.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Flippers, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Somaria, 1);

          checkChestAvailability(location, Availability.Available);
        });
      })
    });

    describe( 'set to the misery mire', () => {
      const location = Location.MiseryMire;

      describe('-- the boss --', () => {
        it( 'requires the big key to get to the room.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'can be done with dark room navigation if the big key is on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkBossAvailability(location, Availability.Glitches);
        });

        it( 'can be done logically if the big key & lantern are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Available);
        });
      });

      describe('-- the chests --', () => {
        it( 'starts off as possible with bare equipment.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'becomes impossible if the big key was not found prior to the last three chests.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is still possible if the big key was found prior to the last three chests.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is still possible when two chests to go if big key and fire rod are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is still possible illogically with one chest to go if all but lantern are on hand.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Somaria, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is fully raidable with the lantern, cane of somaria, and big key.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Lantern, 1);
          itemService.setItemState(ItemKey.Somaria, 1);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });

    describe( 'set to turtle rock', () => {
      const location = Location.TurtleRock;

      describe( '-- the boss --', () => {
        it( 'requires more than outside items to get to the boss.', () => {
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'requires more than a big key to get to the boss.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);

          checkBossAvailability(location, Availability.Unavailable);
        });

        it( 'requires three small keys to maybe get to the boss illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);

          checkBossAvailability(location, Availability.Glitches);
        });

        it( 'requires three small keys to maybe get to the boss logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Possible);
        });

        it( 'requires four small keys to get to the boss illogically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);

          checkBossAvailability(location, Availability.Glitches);
        });

        it( 'requires four small keys to get to the boss logically.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkBossAvailability(location, Availability.Available);
        });
      });

      describe( '-- the chests --', () => {
        it( 'is potentially raidable once inside.', () => {
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'can be unraidable if nothing is gotten within the first few chests.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Unavailable);
        });

        it( 'is possible to raid if a fire rod is gotten within the first few chests.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid if the big key and two small keys are gotten within the first few chests.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid if the four chests give 2 keys and the fire rod.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid if the five chests give 2 keys, the big key, and the fire rod.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid illogically if down to 5 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is possible to raid logically if down to 5 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid illogically if down to 4 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is possible to raid logically if down to 4 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid illogically if down to 2 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is possible to raid logically if down to 3 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid illogically if down to 3 chests with good key counts and rods.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is possible to raid logically if down to 3 chests with good key counts and rods.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is possible to raid illogically if down to 2 chests with good key counts and safeties.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);

          checkChestAvailability(location, Availability.Glitches);
        });

        it( 'is possible to raid logically if down to 2 chests with good key counts and rods.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          dungeon.decrementTotalChestCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.Byrna, 1);
          itemService.setItemState(ItemKey.Lantern, 1);

          checkChestAvailability(location, Availability.Possible);
        });

        it( 'is fully raidable with all keys, both rods, lantern, and cape.', () => {
          const dungeon = dungeonService.getDungeon(location);
          dungeon.toggleBigKey();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          dungeon.incrementSmallKeyCount();
          itemService.setItemState(ItemKey.MoonPearl, 1);
          itemService.setItemState(ItemKey.Hammer, 1);
          itemService.setItemState(ItemKey.Glove, 2);
          itemService.setItemState(ItemKey.Somaria, 1);
          itemService.setItemState(ItemKey.Hookshot, 1);
          itemService.setItemState(ItemKey.Sword, 3);
          itemService.setItemState(ItemKey.Bombos, 1);
          itemService.setItemState(ItemKey.Ether, 1);
          itemService.setItemState(ItemKey.Quake, 1);
          itemService.setItemState(ItemKey.FireRod, 1);
          itemService.setItemState(ItemKey.IceRod, 1);
          itemService.setItemState(ItemKey.Lantern, 1);
          itemService.setItemState(ItemKey.Cape, 1);

          checkChestAvailability(location, Availability.Available);
        });
      });
    });
  });

  afterAll( reset );
});
