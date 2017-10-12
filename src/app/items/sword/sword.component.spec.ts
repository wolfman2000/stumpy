import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SwordComponent } from './sword.component';
import { InventoryService } from '../../inventory.service';
import { Sword } from './sword';

describe( 'The sword component', () => {
  let comp: SwordComponent;
  let fixture: ComponentFixture<SwordComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const serviceStub: any = {
    sword: Sword.None
  };
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        SwordComponent
      ],
      providers: [ {
        provide: InventoryService,
        useValue: serviceStub
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( SwordComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with the no sword state.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
    expect( classes.sword1 ).toBeTruthy();
  } );

  it( 'should switch to the wooden sword state when clicked once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
    expect( classes.sword1 ).toBeTruthy();
  });

  it( 'should switch to the master sword state when clicked twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
    expect( classes.sword2 ).toBeTruthy();
  });

  it( 'should switch to the tempered sword state when clicked three times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
    expect( classes.sword3 ).toBeTruthy();
  });

  it( 'should switch to the golden sword state when clicked four times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
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
    expect( classes.sword1 ).toBeTruthy();
  });
});
