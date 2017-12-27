import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RandomizerTrackerComponent } from './tracker.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GuideModule } from './guide/guide.module';
import { ResetModule } from './reset/reset.module';
import { GoModeModule } from './go-mode/go-mode.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';

import { LocalStorageService } from './local-storage.service';
import { DungeonService } from './dungeon/dungeon.service';
import { SettingsService } from './settings/settings.service';
import { ItemService } from './items/item.service';
import { ItemLocationService } from './map/item-locations/item-location.service';
import { DungeonLocationService } from './map/dungeon-locations/dungeon-location.service';
import { CaptionService } from './caption/caption.service';

import { Mode } from './settings/mode';
import { Difficulty } from './settings/difficulty';

import { WordSpacingPipe } from './word-spacing.pipe';
import { CamelCasePipe } from './camel-case.pipe';

describe( 'The main tracking component', () => {
  let comp: RandomizerTrackerComponent;
  let fixture: ComponentFixture<RandomizerTrackerComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let settingsService: SettingsService;

  beforeAll( () => {
    settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'mode', 'get').and.returnValue( Mode.Open );
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
        CaptionService
      ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        MapModule.forRoot(),
        ItemModule.forRoot(),
        GuideModule.forRoot(),
        ResetModule.forRoot(),
        GoModeModule.forRoot()
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

  it( 'can grab all of the dungeons.', () => {
    expect( comp.allDungeons().length ).toBe( 12 );
  });

  it( 'can hide items depending on Keysanity statuses.', () => {
    expect( comp.getKeysanityClass().hiding ).toBeTruthy();
  });
});
