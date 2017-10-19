import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { ShovelComponent } from './shovel.component';

describe('The shovel component', () => {
  let comp: ShovelComponent;
  let fixture: ComponentFixture<ShovelComponent>;

  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        ShovelComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( ShovelComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no shovel.', () => {
    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the shovel when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should unequip the shovel after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.isActive ).toBeFalsy();
  });
});
