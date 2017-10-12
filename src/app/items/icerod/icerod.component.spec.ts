import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { IceRodComponent } from './icerod.component';

describe( 'The ice rod component', () => {
  let comp: IceRodComponent;
  let fixture: ComponentFixture<IceRodComponent>;
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
        IceRodComponent
      ],
      providers: [ {
        provide: InventoryService,
        useValue: serviceStub
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( IceRodComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no ice rod.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the ice rod when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the ice rod after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
