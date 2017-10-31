import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings/settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { DungeonComponent } from './dungeon/dungeon.component';

describe( 'The application component', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        AppComponent,
        RandomizerSettingsComponent,
        RandomizerTrackerComponent,
        DungeonComponent
      ],
      imports: [
        FormsModule,
        AppRoutingModule,
        MapModule.forRoot(),
        ItemModule.forRoot()
      ],
      providers: [ {
        provide: APP_BASE_HREF,
        useValue: '/'
      }, {
        provide: ComponentFixtureAutoDetect,
        useValue: true
      } ]
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

  it( 'should have the title in a h2 tag.', () => {
    expect( el.querySelector('h2').textContent).toContain('Welcome to Stumpy, a Link to the Past Item Tracker!');
  });
});
