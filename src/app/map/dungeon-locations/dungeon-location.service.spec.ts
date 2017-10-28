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

  describe( 'set to the Palace of Darkness', () => {
    const location = Location.PalaceOfDarkness;

    describe( '-- the boss --', () => {
      it( 'cannot be beaten with no items.', () => {
        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the bow to open the way.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleBow();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer to pound the turtles.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleBow();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs a glove to get in and finish the job, albiet with dark room navigation.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleBow();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'needs a lantern for a legit kill.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleBow();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'cannot be robbed at the start of the game.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer to get in.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the powered gloves to get in.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'can maybe get everything with the hammer and glove.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can maybe get everything if not hammer locked on the boss.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleFlippers();
        inventoryService.toggleBow();
        inventoryService.toggleLantern();
        const dungeon = dungeonService.getDungeon(location);

        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can definitely get everything with the bow and lantern.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.toggleBow();
        inventoryService.toggleLantern();

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
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the mirror.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hookshot.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.toggleHammer();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is available with a glove.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.toggleHammer();
        inventoryService.toggleHookshot();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as not raidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the mirror.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the flippers.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be fully raidable with the titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'should be fully raidable with the titan\'s mitts and hammer.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is no longer fully raidable if the first chest does not have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is now fully raidable if the first chest does have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'is not fully raidable if the first two chests do not have a hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is potentially fully raidable if the first two chests do not have a hookshot.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'is now fully raidable if the first two chests have a hookshot and hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'requires the hookshot and hammer for the last two chests.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is fully raidable with the hookshot and hammer assuming there are only two chests left.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.toggleMoonPearl();
        inventoryService.toggleMirror();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();
        inventoryService.toggleHookshot();

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
        dungeonService.getDungeon(Location.AgahnimTower).toggleDefeat();
        inventoryService.toggleHookshot();
        inventoryService.toggleFlippers();
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the fire rod assuming a non swordless mode.', () => {
        dungeonService.getDungeon(Location.AgahnimTower).toggleDefeat();
        inventoryService.toggleHookshot();
        inventoryService.toggleFlippers();
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFireRod();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the sword to cut the curtains assuming a non swordless mode.', () => {
        dungeonService.getDungeon(Location.AgahnimTower).toggleDefeat();
        inventoryService.toggleHookshot();
        inventoryService.toggleFlippers();
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFireRod();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as unraidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible to get all of the chests without the fire rod.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'is fully raidable with the fire rod.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.toggleFireRod();

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
        inventoryService.toggleByrna();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires outcast access to actually finish the job.', () => {
        inventoryService.toggleByrna();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unraidable', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is theoretically clearable just by getting there.', () => {
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'becomes restricted to possible if down to one chest without the hammer.', () => {
        const dungeon = dungeonService.getDungeon(location);
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();
        dungeon.decrementChestCount();

        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleMoonPearl();

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
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the hammer.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible, with bomb jumping, assuming bombos is on hand.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();
        inventoryService.toggleBombos();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is possible, with bombos and hookshot is on hand.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHammer();
        inventoryService.toggleBombos();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unraidable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the moon pearl.', () => {
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the flippers.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'needs more than the titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'is possible, with bomb jumping, assuming bombos is on hand.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleBombos();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is fully possible with bombos and hammer on hand.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleFlippers();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleBombos();
        inventoryService.toggleHammer();

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
        inventoryService.toggleBow();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires the medallions (and sword) to possibly finish the job.', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'requires a fire source to finish the job...with a dark room', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleFireRod();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'is better to use the lantern to finish the job', () => {
        inventoryService.toggleBow();
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe('-- the chests --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl and titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'becomes possible with the medallions.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });

      it( 'becomes guaranteed with a lantern on hand.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Available);
      });

      it( 'may require the cane of somaria if Vitreous has the second item.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleHookshot();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleLantern();
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
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hammer.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the ice rod.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the fire rod.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();
        inventoryService.toggleFireRod();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be possible with the medallions at the risk of safety.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();
        inventoryService.toggleFireRod();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Possible);
      });

      it( 'can be done with the cape, but it requires dark room navigation.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();
        inventoryService.toggleFireRod();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleCape();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Glitches);
      });

      it( 'can be done with the cane of byrna and the lantern without breaks.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();
        inventoryService.toggleFireRod();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();
        inventoryService.toggleByrna();
        inventoryService.toggleLantern();

        expect( dungeonLocationService.getBossAvailability(location)).toBe(Availability.Available);
      });
    });

    describe( '-- the chests --', () => {
      it( 'starts off as unavailable.', () => {
        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the moon pearl.', () => {
        inventoryService.toggleMoonPearl();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hammer.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the titan\'s mitts.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the cane of somaria.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'requires more than the hookshot.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Unavailable);
      });

      it( 'may be possible with the medallions at the risk of safety.', () => {
        inventoryService.toggleMoonPearl();
        inventoryService.toggleHammer();
        inventoryService.incrementGlove();
        inventoryService.incrementGlove();
        inventoryService.toggleSomaria();
        inventoryService.toggleHookshot();
        inventoryService.toggleIceRod();
        inventoryService.toggleFireRod();
        inventoryService.toggleBombos();
        inventoryService.toggleEther();
        inventoryService.toggleQuake();
        inventoryService.incrementSword();

        expect( dungeonLocationService.getChestAvailability(location)).toBe(Availability.Possible);
      });
    });
  });
});
