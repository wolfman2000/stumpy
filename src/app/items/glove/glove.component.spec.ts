import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { GloveComponent } from './glove.component';
import { Glove } from './glove';

describe('The glove component', () => {
  let comp: GloveComponent;
  let fixture: ComponentFixture<GloveComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        GloveComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( GloveComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no gloves.', () => {
    const classes: any = comp.getClasses();
    expect( classes.power ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the power gloves when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.power ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having the titan\'s mitts after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.titan ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having no gloves after clicking three times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.power ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });
});
