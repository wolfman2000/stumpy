import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RandomizerSettingsComponent } from './settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { SwordComponent } from './items/sword/sword.component';
import { BowComponent } from './items/bow/bow.component';
import { FireRodComponent } from './items/firerod/firerod.component';
import { IceRodComponent } from './items/icerod/icerod.component';

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
        SwordComponent,
        BowComponent,
        FireRodComponent,
        IceRodComponent
      ],
      imports: [
        FormsModule,
        AppRoutingModule
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

  it( 'should have the title in a h1 tag.', () => {
    expect( el.querySelector('h1').textContent).toContain('Welcome to Stumpy, a Link to the Past Item Tracker!');
  });
});
