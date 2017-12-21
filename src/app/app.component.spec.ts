import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { CaptionModule } from './caption/caption.module';
import { MapModule } from './map/map.module';
import { ItemModule } from './items/item.module';
import { GuideModule } from './guide/guide.module';
import { ResetModule } from './reset/reset.module';

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
        NgbModule.forRoot(),
        FormsModule,
        AppRoutingModule,
        CaptionModule.forRoot(),
        MapModule.forRoot(),
        ItemModule.forRoot(),
        GuideModule.forRoot(),
        ResetModule.forRoot()
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

  it( 'should have the title within a jumbotron\'s container\'s alert box.', () => {
    const targetEl = el.querySelector('.jumbotron').querySelector('.container').querySelector('ngb-alert');
    expect( targetEl.textContent ).toContain('Welcome to Stumpy, a Link to the Past Item Tracker!');
  });
});
