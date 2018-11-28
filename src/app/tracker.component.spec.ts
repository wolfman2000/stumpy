import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RandomizerTrackerComponent } from './tracker.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavigationModule } from './navigation/navigation.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';
import { DungeonModule } from './dungeon/dungeon.module';

import { LocalStorageService } from './local-storage.service';
import { DungeonService } from './dungeon/dungeon.service';
import { SettingsService } from './settings/settings.service';
import { ItemService } from './items/item.service';
import { ItemLocationService } from './map/item-locations/item-location.service';
import { DungeonLocationService } from './map/dungeon-locations/dungeon-location.service';
import { CaptionService } from './caption/caption.service';
import { BossService } from './boss/boss.service';

import { SwordLogic } from './settings/sword-logic';
import { Difficulty } from './settings/difficulty';

import { WordSpacingPipe } from './word-spacing.pipe';
import { CamelCasePipe } from './camel-case.pipe';
import { SaveService } from './save.service';

describe( 'The main tracking component', () => {
  let comp: RandomizerTrackerComponent;
  let fixture: ComponentFixture<RandomizerTrackerComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let settingsService: SettingsService;

  beforeAll( () => {
    settingsService = new SettingsService( new SaveService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Randomized );
    spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Normal );
  });

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
      declarations: [
        RandomizerTrackerComponent
      ],
      providers: [
        WordSpacingPipe,
        CamelCasePipe,
        LocalStorageService,
        SettingsService,
        DungeonService,
        ItemService,
        ItemLocationService,
        DungeonLocationService,
        CaptionService,
        BossService,
        SaveService
      ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        DungeonModule.forRoot(),
        MapModule.forRoot(),
        ItemModule.forRoot(),
        NavigationModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent( RandomizerTrackerComponent );
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  }));

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });
});
