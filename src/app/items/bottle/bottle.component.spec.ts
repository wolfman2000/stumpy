import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { BottleComponent } from './bottle.component';

describe('The bottle component', () => {
  let comp: BottleComponent;
  let fixture: ComponentFixture<BottleComponent>;
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
        BottleComponent
      ],
      providers: [ {
        provide: InventoryService,
        useValue: serviceStub
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( BottleComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no bottles.', () => {
    const classes: any = comp.getClasses();
    expect( classes.bottle0 ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having one bottle when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.bottle1 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having two bottles after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.bottle2 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having three bottles after clicking three times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.bottle3 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having four bottles after clicking four times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.bottle4 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having zero bottles after clicking five times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.bottle0 ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });
});
