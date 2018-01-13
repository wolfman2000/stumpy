import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CaptionModule } from './caption/caption.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';
import { NavigationModule } from './navigation/navigation.module';
import { DungeonModule } from './dungeon/dungeon.module';

import { AppComponent } from './app.component';
import { RandomizerTrackerComponent } from './tracker.component';

import { DungeonService } from './dungeon/dungeon.service';
import { SettingsService } from './settings/settings.service';
import { LocalStorageService } from './local-storage.service';
import { ItemService } from './items/item.service';
import { ItemLocationService } from './map/item-locations/item-location.service';
import { DungeonLocationService } from './map/dungeon-locations/dungeon-location.service';
import { BossService } from './boss/boss.service';
import { GoModeService } from './go-mode/go-mode.service';
import { CaptionService } from './caption/caption.service';

import { WordSpacingPipe } from './word-spacing.pipe';
import { CamelCasePipe } from './camel-case.pipe';

describe( 'The application component', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        AppComponent,
        RandomizerTrackerComponent
      ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        NavigationModule.forRoot(),
        CaptionModule.forRoot(),
        MapModule.forRoot(),
        ItemModule.forRoot(),
        DungeonModule.forRoot()
      ],
      providers: [
        WordSpacingPipe,
        CamelCasePipe,
        DungeonService,
        SettingsService,
        LocalStorageService,
        ItemService,
        ItemLocationService,
        DungeonLocationService,
        BossService,
        GoModeService,
        CaptionService,
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( AppComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should have the title be set correctly.', () => {
    expect( de.componentInstance.title ).toEqual('Stumpy, a Link to the Past Item Tracker');
  });

  it( 'should have the title within a jumbotron\'s container\'s alert box.', () => {
    const targetEl = el.querySelector('.jumbotron').querySelector('.container').querySelector('ngb-alert');
    expect( targetEl.textContent ).toContain('Welcome to Stumpy, a Link to the Past Item Tracker!');
  });
});
