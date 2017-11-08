import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ItemComponent } from './item.component';
import { ItemService } from './item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { ItemKey } from './item-key';

describe( 'The item component', () => {
  let comp: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let itemService: ItemService;
  const mouseEvt = new MouseEvent('test');

  beforeEach(() => {
    const store: any = {};

    spyOn( localStorage, 'getItem' ).and.callFake( (key: string): string => {
      return store[key] || null;
    });

    spyOn( localStorage, 'removeItem' ).and.callFake( (key: string): void => {
      delete store[key];
    });

    spyOn( localStorage, 'setItem' ).and.callFake( (key: string, value: string): void => {
      store[key] = value;
    });
  });

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent],
      providers: [ItemService, SettingsService, LocalStorageService]
    }).compileComponents();
  }));

  describe( 'set to the boomerangs', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent( ItemComponent );
      comp = fixture.componentInstance;
      comp.itemId = ItemKey.Boomerangs;
      fixture.detectChanges();

      de = fixture.debugElement;
      el = de.nativeElement;
      itemService = de.injector.get( ItemService );
    });

    it( 'should be created successfully.', () => {
      expect( de.componentInstance ).toBeTruthy();
    });

    it( 'should start as not active.', () => {
      const classes = comp.getClasses();
      expect( classes.isActive ).toBeFalsy();
    });

    it( 'will be set to active upon clicking on it once.', () => {
      comp.whenClicked(mouseEvt);

      const classes = comp.getClasses();
      expect( classes.isActive ).toBeTruthy();
    });
  });
});
