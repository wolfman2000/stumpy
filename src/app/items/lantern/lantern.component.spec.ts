import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { LanternComponent } from './lantern.component';

describe('The lantern component', () => {
  let comp: LanternComponent;
  let fixture: ComponentFixture<LanternComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        LanternComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( LanternComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no lantern.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the lantern when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the lantern after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
