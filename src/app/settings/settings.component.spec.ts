import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RandomizerSettingsComponent } from './settings.component';

import { SettingsService } from './settings.service';

import { WordSpacingPipe } from '../word-spacing.pipe';
import { LocalStorageService } from '../local-storage.service';

import { Mode } from './mode';
import { Difficulty } from './difficulty';

describe( 'The settings component', () => {
  let comp: RandomizerSettingsComponent;
  let fixture: ComponentFixture<RandomizerSettingsComponent>;
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
      declarations: [RandomizerSettingsComponent],
      providers: [
        WordSpacingPipe,
        LocalStorageService,
        SettingsService
      ],
      imports: [FormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent( RandomizerSettingsComponent );
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  }));

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });
});
