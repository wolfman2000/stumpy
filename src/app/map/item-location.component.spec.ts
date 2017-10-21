import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ItemLocationComponent } from './item-location.component';
import { ItemLocationService } from './item-location.service';
import { InventoryService } from '../inventory.service';
import { DungeonService } from '../dungeon/dungeon.service';

describe( 'The item location component', () => {
  let comp: ItemLocationComponent;
  let fixture: ComponentFixture<ItemLocationComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let itemLocationService: ItemLocationService;
  let inventoryService: InventoryService;
  const mouseEvt = new MouseEvent('test');

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemLocationComponent],
      providers: [ItemLocationService, InventoryService, DungeonService]
    }).compileComponents();
  }));

  describe( 'set to the King\'s tomb', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent( ItemLocationComponent );
      comp = fixture.componentInstance;
      comp.itemLocationId = 0;
      fixture.detectChanges();

      de = fixture.debugElement;
      el = de.nativeElement;
      itemLocationService = de.injector.get( ItemLocationService );
    });

    it( 'should be created successfully.', () => {
      expect( de.componentInstance ).toBeTruthy();
    });

    it( 'should start off as being unavailable.', () => {
      const classes = comp.getClasses();
      expect( classes.unavailable ).toBeTruthy();
    });

    it( 'should be marked as claimed if clicked on, even if the item is still technically unavailable.', () => {
      comp.whenClicked(mouseEvt);

      const classes = comp.getClasses();
      expect( classes.unavailable ).toBeTruthy();
      expect( classes.claimed ).toBeTruthy();
    });
  });
});
