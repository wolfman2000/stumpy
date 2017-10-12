import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { BoomerangComponent } from './boomerang.component';

describe('The boomerang component', () => {
  let comp: BoomerangComponent;
  let fixture: ComponentFixture<BoomerangComponent>;

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
        BoomerangComponent
      ],
      providers: [ {
        provide: InventoryService,
        useValue: serviceStub
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( BoomerangComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no boomerangs.', () => {
    const classes: any = comp.getClasses();
    expect( classes.blueBoomerang ).toBeTruthy();
    expect( classes.redBoomerang ).toBeFalsy();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the blue boomerang when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.blueBoomerang ).toBeTruthy();
    expect( classes.redBoomerang ).toBeFalsy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having the red boomerang, not the blue one, when clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.blueBoomerang ).toBeFalsy();
    expect( classes.redBoomerang ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having both boomerangs when clicking three times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.blueBoomerang ).toBeTruthy();
    expect( classes.redBoomerang ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should cycle back to no boomerangs after clicking four times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.blueBoomerang ).toBeTruthy();
    expect( classes.redBoomerang ).toBeFalsy();
    expect( classes.isActive ).toBeFalsy();
  });
});
