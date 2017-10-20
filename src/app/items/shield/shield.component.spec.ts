import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { ShieldComponent } from './shield.component';
import { Shield } from './shield';

describe('The shield component', () => {
  let comp: ShieldComponent;
  let fixture: ComponentFixture<ShieldComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
      declarations: [
        ShieldComponent
      ],
      providers: [InventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( ShieldComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;

    service = de.injector.get( InventoryService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start with no shield.', () => {
    const classes: any = comp.getClasses();
    expect( classes.shield1 ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });

  it( 'should switch to having the small shield when clicking once.', () => {
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.shield1 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having the magic shield after clicking twice.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.shield2 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should switch to having the mirror shield after clicking three times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.shield3 ).toBeTruthy();
    expect( classes.isActive ).toBeTruthy();
  });

  it( 'should go back to no shield after clicking four times.', () => {
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);
    comp.whenClicked(mouseEvt);

    const classes: any = comp.getClasses();
    expect( classes.shield1 ).toBeTruthy();
    expect( classes.isActive ).toBeFalsy();
  });
});
