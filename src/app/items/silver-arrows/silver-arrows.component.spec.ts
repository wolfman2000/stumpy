import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { SilverArrowsComponent } from './silver-arrows.component';

describe('The silver arrows component', () => {
  let comp: SilverArrowsComponent;
  let fixture: ComponentFixture<SilverArrowsComponent>;

  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        SilverArrowsComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( SilverArrowsComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no silver arrows.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the silver arrows when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the silver arrows after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
