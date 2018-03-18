import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SettingsComponent } from './settings.component';

import { SettingsService } from './settings.service';

import { WordSpacingPipe } from '../word-spacing.pipe';
import { LocalStorageService } from '../local-storage.service';

import { SwordLogic } from './sword-logic';
import { Difficulty } from './difficulty';

describe( 'The settings component', () => {
  let comp: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let settingsService: SettingsService;
  let modalService: NgbModal;
//  let modalRef: NgbModalRef;

  beforeAll( () => {
    settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
    spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Randomized );
    spyOnProperty( settingsService, 'difficulty', 'get').and.returnValue( Difficulty.Normal );
  });

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
      declarations: [SettingsComponent],
      providers: [
        NgbModal,
        WordSpacingPipe,
        LocalStorageService,
        SettingsService
      ],
      imports: [NgbModule.forRoot(),FormsModule]
    }).compileComponents();

    modalService = TestBed.get(NgbModal);
    fixture = TestBed.createComponent( SettingsComponent );
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  }));

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });
});
