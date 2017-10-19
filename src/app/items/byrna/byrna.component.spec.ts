import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { ByrnaComponent } from './byrna.component';

describe('The byrna component', () => {
  let comp: ByrnaComponent;
  let fixture: ComponentFixture<ByrnaComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        ByrnaComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( ByrnaComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no cane of byrna.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the cane of byrna when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the cane of byrna after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
