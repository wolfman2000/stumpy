import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { ResetComponent } from './reset.component';

import { CamelCasePipe } from '../camel-case.pipe';
import { WordSpacingPipe } from '../word-spacing.pipe';

import { ItemService } from '../items/item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { ItemLocationService } from '../map/item-locations/item-location.service';
import { DungeonLocationService } from '../map/dungeon-locations/dungeon-location.service';

import { ItemKey } from '../items/item-key';

import { Mode } from '../settings/mode';
import { Difficulty } from '../settings/difficulty';

describe( 'The reset component', () => {
  let comp: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mouseEvt = new MouseEvent('test');

  let itemService: ItemService;
  let dungeonService: DungeonService;
  let itemLocationService: ItemLocationService;
  let settingsService: SettingsService;
  let dungeonLocationService: DungeonLocationService;

  beforeAll( () => {
    settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Open );
    spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Normal );
  });

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
      declarations: [ResetComponent],
      providers: [
        CamelCasePipe,
        WordSpacingPipe,
        LocalStorageService,
        SettingsService,
        ItemService,
        DungeonService,
        ItemLocationService,
        DungeonLocationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent( ResetComponent );
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    itemService = de.injector.get( ItemService );
    dungeonService = de.injector.get( DungeonService );
    itemLocationService = de.injector.get( ItemLocationService );
    dungeonLocationService = de.injector.get( DungeonLocationService );
  }));

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should be able to reset everything.', () => {
    itemService.setItemState( ItemKey.Sword, 1 );

    comp.whenClicked( mouseEvt );

    expect( itemService.sword ).toBe( 0 );
  });
});
