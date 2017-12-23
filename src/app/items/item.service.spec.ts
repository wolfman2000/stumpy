import { ItemService } from './item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { GlitchLogic } from '../settings/glitch-logic';
import { Mode } from '../settings/mode';
import { Difficulty } from '../settings/difficulty';

import { Sword } from './sword';
import { Item } from './item';
import { ItemKey } from './item-key';

describe( 'The item service', () => {
  let itemService: ItemService;
  let settingsService: SettingsService;

  describe( '-- in swordless mode --', () => {
    beforeAll(() => {
      settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Swordless );
      spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Normal );
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

    it( 'will never have active sword classes.', () => {
      const classes = itemService.getItemClasses(ItemKey.Sword);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'can always have access to the silver arrows, no matter the difficulty.', () => {
      spyOn( settingsService, 'isExpertOrInsane' ).and.returnValue( true );

      itemService.setItemState( ItemKey.SilverArrows, 1 );

      const classes = itemService.getItemClasses(ItemKey.SilverArrows);

      expect( classes.isActive ).toBeTruthy();
    });

    it( 'cannot get the 1/4 magic upgrade.', () => {
      itemService.setItemState(ItemKey.Magic, 2);
      const classes = itemService.getItemClasses(ItemKey.Magic);
      expect(classes.isActive).toBeFalsy();
    });

    it( 'cannot get the 1/4 magic upgrade, even through deception.', () => {
      itemService.getItem(ItemKey.Magic).state = 2;
      const classes = itemService.getItemClasses(ItemKey.Magic);
      expect(classes.isActive).toBeFalsy();
    });
  });

  describe( '-- in expert open mode --', () => {
    beforeAll(() => {
      settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Open );
      spyOn( settingsService, 'isExpertOrInsane' ).and.returnValue( true );
      spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Expert );
    });

    beforeEach(() => {
      itemService = new ItemService( settingsService );
    });

    it( 'can still get the bow as it is required to win.', () => {
      itemService.setItemState(ItemKey.Bow, 1);
      expect( itemService.getItemClasses(ItemKey.Bow).isActive ).toBeTruthy();
    });

    it( 'can still get the ice rod in case Trinexx must be defeated.', () => {
      itemService.setItemState(ItemKey.IceRod, 1);
      expect( itemService.getItemClasses(ItemKey.IceRod).isActive ).toBeTruthy();
    });

    it( 'can still get the quake medallion in case Turtle Rock has its vanilla medallion.', () => {
      itemService.setItemState(ItemKey.Quake, 1);
      expect( itemService.getItemClasses(ItemKey.Quake).isActive ).toBeTruthy();
    });

    it( 'cannot get the silver arrows, which means Ganon is harder to defeat.', () => {
      itemService.setItemState( ItemKey.SilverArrows, 1 );
      const classes = itemService.getItemClasses(ItemKey.SilverArrows);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'cannot go above the master sword.', () => {
      itemService.setItemState( ItemKey.Sword, 3);
      const classes = itemService.getItemClasses(ItemKey.Sword);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });

    it( 'cannot go above the master sword even if deception was done.', () => {
      itemService.getItem(ItemKey.Sword).state = 3;
      const classes = itemService.getItemClasses(ItemKey.Sword);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });

    it( 'cannot get any boomerang weapon.', () => {
      itemService.setItemState( ItemKey.Boomerangs, 1);
      const classes = itemService.getItemClasses(ItemKey.Boomerangs);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.boomerang1 ).toBeTruthy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'cannot get any magic upgrades.', () => {
      itemService.setItemState( ItemKey.Magic, 1);
      const classes = itemService.getItemClasses(ItemKey.Magic);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.magic1 ).toBeTruthy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'cannot get any tunic upgrades.', () => {
      itemService.setItemState( ItemKey.Tunic, 1);
      const classes = itemService.getItemClasses(ItemKey.Tunic);
      expect( classes.isActive ).toBeTruthy();
      expect( classes.tunic1 ).toBeTruthy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'cannot get any shields.', () => {
      itemService.setItemState(ItemKey.Shield, 1);
      const classes = itemService.getItemClasses(ItemKey.Shield);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.shield1 ).toBeTruthy();
      expect( classes.restricted ).toBeTruthy();
    });

    it( 'can have four bottles, but only when using magic glitches.', () => {
      spyOnProperty( settingsService, 'logic', 'get').and.returnValue( GlitchLogic.Major );
      itemService.setItemState(ItemKey.Bottle, 4);

      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeTruthy();
      expect( classes.bottle4 ).toBeTruthy();
    });

    it( 'cannot have more than one bottle set.', () => {
      itemService.setItemState(ItemKey.Bottle, 2);

      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.bottle0 ).toBeTruthy();
    });

    it( 'cannot have more than one bottle set, even through deception.', () => {
      itemService.getItem(ItemKey.Bottle).state = 2;

      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.bottle0 ).toBeTruthy();
    });

    it( 'can only have one bottle normally.', () => {
      itemService.setItemState(ItemKey.Bottle, 1);

      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeTruthy();
      expect( classes.bottle1 ).toBeTruthy();
    });

    it( 'can still get the net, though its usage will be limited.', () => {
      itemService.setItemState(ItemKey.Net, 1);

      const classes = itemService.getItemClasses(ItemKey.Net);
      expect( classes.isActive).toBeTruthy();
      expect( classes.net).toBeTruthy();
    });
  });

  describe( '-- in hard mode --', () => {
    beforeAll(() => {
      settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Open );
      spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Hard );
    });

    beforeEach(() => {
      itemService = new ItemService( settingsService );
    });

    it( 'cannot have three or more bottles normally.', () => {
      itemService.setItemState(ItemKey.Bottle, 3);
      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.bottle0 ).toBeTruthy();
    });

    it( 'cannot have three or more bottles normally, even with deception.', () => {
      itemService.getItem(ItemKey.Bottle).state = 3;
      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.bottle0 ).toBeTruthy();
    });

    it( 'can have two bottles, though.', () => {
      itemService.setItemState(ItemKey.Bottle, 2);
      const classes = itemService.getItemClasses( ItemKey.Bottle);
      expect( classes.isActive ).toBeTruthy();
      expect( classes.bottle2 ).toBeTruthy();
    });

    it( 'cannot have the red tunic.', () => {
      itemService.setItemState(ItemKey.Tunic, 2);
      const classes = itemService.getItemClasses(ItemKey.Tunic);
      expect( classes.tunic1 ).toBeTruthy();
    });

    it( 'cannot have the red tunic, even with deception.', () => {
      itemService.getItem(ItemKey.Tunic).state = 2;
      const classes = itemService.getItemClasses(ItemKey.Tunic);
      expect( classes.tunic1 ).toBeTruthy();
    });

    it( 'cannot have the mirror shield.', () => {
      itemService.setItemState(ItemKey.Shield, 3);
      const classes = itemService.getItemClasses(ItemKey.Shield);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.shield1 ).toBeTruthy();
    });

    it( 'cannot have the mirror shield, even with deception.', () => {
      itemService.getItem(ItemKey.Shield).state = 3;
      const classes = itemService.getItemClasses(ItemKey.Shield);
      expect( classes.isActive ).toBeFalsy();
      expect( classes.shield1 ).toBeTruthy();
    });

    it( 'cannot have the golden sword.', () => {
      itemService.setItemState(ItemKey.Sword, Sword.Golden);
      const classes = itemService.getItemClasses(ItemKey.Sword);
      expect( classes.isActive).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });

    it( 'cannot have the golden sword, even with deception.', () => {
      itemService.getItem(ItemKey.Sword).state = Sword.Golden;
      const classes = itemService.getItemClasses(ItemKey.Sword);
      expect( classes.isActive).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });
  });
});
