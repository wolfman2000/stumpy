import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DungeonComponent } from './dungeon.component';
import { DungeonService } from './dungeon.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { CamelCasePipe } from '../camel-case.pipe';
import { WordSpacingPipe } from '../word-spacing.pipe';

import { Location } from './location';
import { EntranceLock } from './entrance-lock';
import { Reward } from './reward';
import { SaveService } from '../save.service';

describe( 'The dungeon component', () => {
  let comp: DungeonComponent;
  let fixture: ComponentFixture<DungeonComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: DungeonService;
  const serviceStub: any = {};
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [DungeonComponent],
      providers: [
        DungeonService,
        SettingsService,
        LocalStorageService,
        CamelCasePipe,
        WordSpacingPipe,
        SaveService
      ]
    }).compileComponents();
  }));

  describe('set to Eastern Palace', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent( DungeonComponent );
      comp = fixture.componentInstance;
      comp.dungeonId = 1;
      fixture.detectChanges();
      de = fixture.debugElement;
      el = de.nativeElement;
      service = de.injector.get( DungeonService );
      service.reset();
    });

    it( 'should be created successfully.', () => {
      expect( de.componentInstance ).toBeTruthy();
    });

    it( 'should start with three items inside.', () => {
      expect( comp.hasChests() ).toBeTruthy();
      expect( comp.getChestClasses().chest3 ).toBeTruthy();
    });

    it( 'will run out of items inside after three clicks.', () => {
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);

      expect( comp.getChestClasses().chest0 ).toBeTruthy();
    });

    it( 'should not have any medallion requirements.', () => {
      expect( comp.hasMedallion() ).toBeFalsy();
    });

    it( 'should not react to any medallion events.', () => {
      comp.whenMedallionClicked(mouseEvt);

      expect( comp.hasMedallion() ).toBeFalsy();
    });

    it( 'should have a boss that starts alive.', () => {
      expect( comp.getBossClasses().isBeaten ).toBeFalsy();
    });

    it( 'should have a defeated boss when the check box is clicked.', () => {
      comp.whenBossToggleClicked(mouseEvt);

      expect( comp.getBossClasses().isBeaten ).toBeTruthy();
    });
  });

  describe('set to Turtle Rock', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent( DungeonComponent );
      comp = fixture.componentInstance;
      comp.dungeonId = 10;
      fixture.detectChanges();
      de = fixture.debugElement;
      el = de.nativeElement;
      service = de.injector.get( DungeonService );
      service.reset();
    });

    it( 'should be created successfully.', () => {
      expect( de.componentInstance ).toBeTruthy();
    });

    it( 'should start with five items inside.', () => {
      expect( comp.hasChests() ).toBeTruthy();
      expect( comp.getChestClasses().chest5 ).toBeTruthy();
    });

    it( 'will run out of items inside after three clicks.', () => {
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);
      comp.whenChestClicked(mouseEvt);

      expect( comp.getChestClasses().chest0 ).toBeTruthy();
    });

    it( 'should have any medallion requirements.', () => {
      expect( comp.hasMedallion() ).toBeTruthy();
      expect( comp.getMedallionClasses().unknown ).toBeTruthy();
    });

    it( 'should react to any medallion events.', () => {
      comp.whenMedallionClicked(mouseEvt);

      expect( comp.hasMedallion() ).toBeTruthy();
      expect( comp.getMedallionClasses().bombos ).toBeTruthy();
    });

    it( 'should have a boss that starts alive.', () => {
      expect( comp.getBossClasses().isBeaten ).toBeFalsy();
    });

    it( 'should have a defeated boss when the check box is clicked.', () => {
      comp.whenBossToggleClicked(mouseEvt);

      expect( comp.getBossClasses().isBeaten ).toBeTruthy();
    });

    it( 'should start with no known reward.', () => {
      expect( comp.getRewardClasses().unknown ).toBeTruthy();
    });

    it( 'should cycle to the fairy crystal after four clicks.', () => {
      comp.whenRewardClicked(mouseEvt);
      comp.whenRewardClicked(mouseEvt);
      comp.whenRewardClicked(mouseEvt);
      comp.whenRewardClicked(mouseEvt);

      expect( comp.getRewardClasses().fairyCrystal ).toBeTruthy();
    });
  });
});
