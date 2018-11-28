import { GoModeService } from './go-mode.service';

import { ItemService } from '../items/item.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { SettingsService } from '../settings/settings.service';
import { DungeonLocationService } from '../map/dungeon-locations/dungeon-location.service';
import { LocalStorageService } from '../local-storage.service';
import { BossService } from '../boss/boss.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { Dungeon } from '../dungeon/dungeon';

import { Location } from '../dungeon/location';
import { ItemKey } from '../items/item-key';

import { Goal } from '../settings/goal';
import { SwordLogic } from '../settings/sword-logic';
import { Availability } from '../map/availability';
import { settings } from 'cluster';
import { SaveService } from '../save.service';

describe( 'The Go Mode service', () => {
  let dungeonLocationService: DungeonLocationService;
  let itemService: ItemService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;
  let goModeService: GoModeService;
  let bossService: BossService;
  let saveService: SaveService;

  beforeAll(() => {
    saveService = new SaveService();
    settingsService = new SettingsService( new SaveService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.UncleAssured );
  });

  function reset() {
    itemService = new ItemService( settingsService, saveService );
    itemService.reset();
    dungeonService = new DungeonService( saveService );
    dungeonService.reset();
    bossService = new BossService( settingsService, itemService );
    dungeonLocationService = new DungeonLocationService( itemService, dungeonService, settingsService, bossService );
    dungeonLocationService.reset();

    goModeService = new GoModeService( itemService, dungeonService, dungeonLocationService, settingsService );
  }

  describe( 'set to the default goal of defeating Ganon', () => {
    beforeEach(() => {
      spyOnProperty( settingsService, 'goal', 'get').and.returnValue( Goal.Ganon );
      reset();
    });

    it( 'can never start in go mode.', () => {
      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    it( '(almost) always requires more than a bow.', () => {
      itemService.setItemState(ItemKey.Bow, 1);

      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    it( '(almost) always requires more than the hammer.', () => {
      itemService.setItemState(ItemKey.Bow, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    it( '(almost) always requires more than the fire rod.', () => {
      itemService.setItemState(ItemKey.Bow, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.FireRod, 1);

      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    it( 'always requires a master sword as well.', () => {
      itemService.setItemState(ItemKey.Bow, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Sword, 2);

      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    function setVanillaDungeonRewards() {
      dungeonService.getDungeon(Location.PalaceOfDarkness).cycleReward();
      dungeonService.getDungeon(Location.PalaceOfDarkness).cycleReward();
      dungeonService.getDungeon(Location.PalaceOfDarkness).cycleReward();

      dungeonService.getDungeon(Location.SwampPalace).cycleReward();
      dungeonService.getDungeon(Location.SwampPalace).cycleReward();
      dungeonService.getDungeon(Location.SwampPalace).cycleReward();

      dungeonService.getDungeon(Location.SkullWoods).cycleReward();
      dungeonService.getDungeon(Location.SkullWoods).cycleReward();
      dungeonService.getDungeon(Location.SkullWoods).cycleReward();

      dungeonService.getDungeon(Location.ThievesTown).cycleReward();
      dungeonService.getDungeon(Location.ThievesTown).cycleReward();
      dungeonService.getDungeon(Location.ThievesTown).cycleReward();

      dungeonService.getDungeon(Location.IcePalace).cycleReward();
      dungeonService.getDungeon(Location.IcePalace).cycleReward();
      dungeonService.getDungeon(Location.IcePalace).cycleReward();
      dungeonService.getDungeon(Location.IcePalace).cycleReward();

      dungeonService.getDungeon(Location.MiseryMire).cycleReward();
      dungeonService.getDungeon(Location.MiseryMire).cycleReward();
      dungeonService.getDungeon(Location.MiseryMire).cycleReward();
      dungeonService.getDungeon(Location.MiseryMire).cycleReward();

      dungeonService.getDungeon(Location.TurtleRock).cycleReward();
      dungeonService.getDungeon(Location.TurtleRock).cycleReward();
      dungeonService.getDungeon(Location.TurtleRock).cycleReward();
    }

    it( 'requires knowing more than which dungeons are the crystal dungeons.', () => {
      setVanillaDungeonRewards();
      itemService.setItemState(ItemKey.Bow, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Sword, 2);

      expect( goModeService.isGoMode() ).toBe( Availability.Unavailable );
    });

    function setMostGoModeItems() {
      itemService.setItemState(ItemKey.Bomb, 1);
      itemService.setItemState(ItemKey.Bow, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Sword, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.IceRod, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Quake, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
    }

    it( 'can possibly be in go mode if willing to skip the safety items for laser bridge.', () => {
      setVanillaDungeonRewards();
      setMostGoModeItems();

      expect( goModeService.isGoMode() ).toBe( Availability.Possible );
    });

    it( 'can be in go mode if willing to skip the silver arrows, though that is a break in the logic.', () => {
      setVanillaDungeonRewards();
      setMostGoModeItems();
      itemService.setItemState(ItemKey.Cape, 1);

      expect( goModeService.isGoMode() ).toBe( Availability.Glitches );
    });

    it( 'can be in go mode if all needed items are grabbed, including silver arrows.', () => {
      setVanillaDungeonRewards();
      setMostGoModeItems();
      itemService.setItemState(ItemKey.Cape, 1);
      itemService.setItemState(ItemKey.Lantern, 1);
      itemService.setItemState(ItemKey.SilverArrows, 1);

      expect( goModeService.isGoMode() ).toBe( Availability.Available );
    });
  });

  afterAll( reset );
} );
