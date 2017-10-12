import { InventoryService } from './inventory.service';
import { Sword } from './items/sword/sword';

describe( 'The inventory', () => {
  let service: InventoryService;

  beforeEach( () => { service = new InventoryService(); } );

  it( 'should start with no sword.', () => {
    expect( service.sword ).toBe( Sword.None );
  } );

  it( 'can cycle once to the wooden sword.', () => {
    service.incrementSword();
    expect( service.sword ).toBe( Sword.Wooden );
  } );

  it( 'can cycle twice to the master sword.', () => {
    service.incrementSword();
    service.incrementSword();
    expect( service.sword ).toBe( Sword.Master );
  } );

  it( 'can cycle three times to the tempered sword.', () => {
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    expect( service.sword ).toBe( Sword.Tempered );
  } );

  it( 'can cycle four times to the golden sword.', () => {
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    expect( service.sword ).toBe( Sword.Golden );
  } );

  it( 'can cycle five times to lose the sword.', () => {
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    service.incrementSword();
    expect( service.sword ).toBe( Sword.None );
  } );
} );
