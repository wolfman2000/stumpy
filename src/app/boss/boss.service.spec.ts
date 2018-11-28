import { BossService } from './boss.service';
import { ItemService } from '../items/item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { ItemKey } from '../items/item-key';

import { SwordLogic } from '../settings/sword-logic';

import { Location } from '../dungeon/location';
import { SaveService } from '../save.service';

describe( 'The boss service', () => {
  let bossService: BossService;
  let itemService: ItemService;
  let settingsService: SettingsService;
  let saveService: SaveService;

  function reset() {
    if (itemService) {
      itemService.reset();
    }
  }

  function validate(location: Location, value: any) {
    expect( bossService.canDefeatBoss(location)).toBe(value);
  }

  describe( 'when not in swordless mode', () => {
    beforeAll(() => {
      saveService = new SaveService();
      settingsService = new SettingsService( new SaveService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Randomized );

      itemService = new ItemService(settingsService, saveService);
      bossService = new BossService(settingsService, itemService);
    });

    beforeEach( reset );

    it( 'cannot defeat the Armos Knights at the start.', () => {
      validate(Location.EasternPalace, false);
    });

    it( 'cannot defeat the Lanmolas at the start.', () => {
      validate(Location.DesertPalace, false);
    });

    it( 'cannot defeat Moldorm at the start.', () => {
      validate(Location.TowerOfHera, false);
    });

    it( 'cannot defeat Agahnim at the start.', () => {
      validate(Location.CastleTower, false);
    });

    it( 'can defeat Agahnim with the bug net.', () => {
      itemService.setItemState(ItemKey.Net, 1);

      validate(Location.CastleTower, true);
    });

    it( 'cannot defeat the Helmasaur King at the start.', () => {
      validate(Location.PalaceOfDarkness, false);
    });

    it( 'can defeat the Helmasaur King with bombs and bow.', () => {
      itemService.setItemState(ItemKey.Bomb, 1);
      itemService.setItemState(ItemKey.Bow, 1);

      validate(Location.PalaceOfDarkness, true);
    });

    it( 'can defeat the Helmasaur King with just the hammer.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(Location.PalaceOfDarkness, true);
    });

    it( 'cannot defeat Arrghus at the start.', () => {
      validate(Location.SwampPalace, false);
    });

    it( 'can defeat Arrghus with the hookshot and bombs. LOTS of bombs.', () => {
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      validate(Location.SwampPalace, true);
    });

    it( 'cannot defeat Mothula at the start.', () => {
      validate(Location.SkullWoods, false);
    });

    it( 'cannot defeat Blind at the start.', () => {
      validate(Location.ThievesTown, false);
    });

    it( 'cannot defeat Kholdstare at the start.', () => {
      validate(Location.IcePalace, false);
    });

    it( 'can defeat Kholdstare with bombos and sword.', () => {
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 2);

      validate(Location.IcePalace, true);
    });

    it( 'cannot defeat Vittreous at the start.', () => {
      validate(Location.MiseryMire, false);
    });

    it( 'cannot defeat Trinexx at the start.', () => {
      validate(Location.TurtleRock, false);
    });

    it( 'cannot defeat Trinexx even with the fire rod and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(Location.TurtleRock, false);
    });

    it( 'can defeat Trinexx with both rods and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.IceRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(Location.TurtleRock, true);
    });
  });

  describe( 'when in swordless mode', () => {
    beforeAll(() => {
      saveService = new SaveService();
      settingsService = new SettingsService( new SaveService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Swordless );

      itemService = new ItemService(settingsService, saveService);
      bossService = new BossService(settingsService, itemService);
    });

    beforeEach( reset );

    it( 'can defeat Kholdstare with fire rod and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(Location.IcePalace, true);
    });
  });

  afterAll( reset );
});
