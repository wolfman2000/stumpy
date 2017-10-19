import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SwordComponent } from './sword.component';
import { InventoryService } from '../../inventory.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';
import { Sword } from './sword';
import { Mode } from '../../settings/mode';

describe( 'The sword component', () => {
  let comp: SwordComponent;
  let fixture: ComponentFixture<SwordComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let inventoryService: InventoryService;
  let settingsService: SettingsService;
  const inventoryStub: any = {
    sword: Sword.None
  };
  const mouseEvt = new MouseEvent('test');

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService());
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

  describe( 'set to Open mode', () => {
    const settingsStub: any = {
      mode: Mode.Open
    };

    beforeEach( async(() => {
      TestBed.configureTestingModule( {
        declarations: [
          SwordComponent
        ],
        providers: [ {
          provide: InventoryService,
          useValue: inventoryStub
        }, {
          provide: SettingsService,
          useValue: settingsStub
        }, LocalStorageService]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent( SwordComponent );

      comp = fixture.componentInstance;

      de = fixture.debugElement;
      el = de.nativeElement;

      inventoryService = de.injector.get( InventoryService );
    });

    it( 'should be created successfully.', () => {
      expect( de.componentInstance ).toBeTruthy();
    });

    it( 'should start with the no sword state.', () => {
      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeFalsy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    } );

    it( 'should switch to the wooden sword state when clicked once.', () => {
      comp.whenClicked(mouseEvt);

      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeTruthy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });

    it( 'should switch to the master sword state when clicked twice.', () => {
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);

      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeTruthy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword2 ).toBeTruthy();
    });

    it( 'should switch to the tempered sword state when clicked three times.', () => {
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);

      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeTruthy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword3 ).toBeTruthy();
    });

    it( 'should switch to the golden sword state when clicked four times.', () => {
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);

      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeTruthy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword4 ).toBeTruthy();
    });

    it( 'should switch back to no sword when clicked five times.', () => {
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);
      comp.whenClicked(mouseEvt);

      const classes: any = comp.getClasses();
      expect( classes.isActive ).toBeFalsy();
      expect( classes.swordless ).toBeFalsy();
      expect( classes.sword1 ).toBeTruthy();
    });
  });

  describe( 'set to swordless mode', () => {
    const settingsStub: any = {
      mode: Mode.Swordless
    };

    beforeEach( async(() => {
      TestBed.configureTestingModule( {
        declarations: [
          SwordComponent
        ],
        providers: [ {
          provide: InventoryService,
          useValue: inventoryStub
        }, {
          provide: SettingsService,
          useValue: settingsStub
        }, LocalStorageService]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent( SwordComponent );

      comp = fixture.componentInstance;
      settingsService.mode = Mode.Swordless;
      fixture.detectChanges();

      de = fixture.debugElement;
      el = de.nativeElement;

      inventoryService = de.injector.get( InventoryService );
    });

    it( 'should not start "displaying" a sword, even if there is nothing that is shown.', () => {
      const classes: any = comp.getClasses();

      expect( classes.sword1 ).toBeTruthy();
    });

    it( 'should not change the sword state.', () => {
      comp.whenClicked(mouseEvt);
      const classes: any = comp.getClasses();

      expect( classes.swordless ).toBeTruthy();
      expect( classes.sword1 ).toBeTruthy();
    });
  });
});
