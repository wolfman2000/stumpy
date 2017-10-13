import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { MoonPearlComponent } from './moon-pearl.component';

describe('The moon pearl component', () => {
  let comp: MoonPearlComponent;
  let fixture: ComponentFixture<MoonPearlComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const serviceStub: any = {
    bow: false
  };
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        MoonPearlComponent
      ],
      providers: [ {
        provide: InventoryService,
        useValue: serviceStub
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( MoonPearlComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no moon pearl.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the moon pearl when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the moon pearl after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
