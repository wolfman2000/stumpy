import { ItemLocationService } from './item-location.service';
import { InventoryService } from '../inventory.service';
import { DungeonService } from '../dungeon/dungeon.service';

import { ItemLocation } from './item-location';
import { Availability } from './availability';

describe( 'The item location service', () => {
  let itemLocationService: ItemLocationService;
  let inventoryService: InventoryService;
  let dungeonService: DungeonService;

  beforeEach( () => {
    inventoryService = new InventoryService();
    dungeonService = new DungeonService();
    itemLocationService = new ItemLocationService( inventoryService, dungeonService );
  });

  describe( 'while focused on King\'s Tomb', () => {
    let kingsTomb: ItemLocation;

    beforeEach( () => {
      kingsTomb = itemLocationService.kingsTomb;
    });

    it( 'starts off as unavailable.', () => {
      expect( kingsTomb.availability ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the pearl and titan\'s mitts.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.incrementGlove();

      expect( kingsTomb.availability ).toBe( Availability.Available );
    });

    it( 'cannot be made available with just the power gloves.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();

      expect( kingsTomb.availability ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the gloves, a hammer, and a mirror, assuming glitches are used.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();

      expect( kingsTomb.availability ).toBe( Availability.Glitches );
    });

    it( 'can cleanly be made available with gloves, hammer, mirror, and boots.', () => {
      inventoryService.toggleMoonPearl();
      inventoryService.incrementGlove();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( kingsTomb.availability ).toBe( Availability.Available );
    });

    it( 'cannot be available if you only defeated Agahnim and have the hookshot.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHookshot();

      expect( kingsTomb.availability ).toBe( Availability.Unavailable );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, a hammer, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleHookshot();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleHammer();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( kingsTomb.availability ).toBe( Availability.Available );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, flippers, and boots.', () => {
      dungeonService.agahnimTower.toggleDefeat();
      inventoryService.toggleHookshot();
      inventoryService.toggleMoonPearl();
      inventoryService.toggleFlippers();
      inventoryService.toggleMirror();
      inventoryService.toggleBoots();

      expect( kingsTomb.availability ).toBe( Availability.Available );
    });
  });
});
