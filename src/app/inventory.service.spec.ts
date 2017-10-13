import { InventoryService } from './inventory.service';
import { Sword } from './items/sword/sword';
import { Shield } from './items/shield/shield';
import { Tunic } from './items/tunic/tunic';
import { Glove } from './items/glove/glove';

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

  it( 'should start with no shield.', () => {
    expect( service.shield ).toBe( Shield.None );
  } );

  it( 'can cycle once to the small shield.', () => {
    service.incrementShield();
    expect( service.shield ).toBe( Shield.Small );
  });

  it( 'can cycle twice to the magic shield.', () => {
    service.incrementShield();
    service.incrementShield();
    expect( service.shield ).toBe( Shield.Magic );
  });

  it( 'can cycle three times to the mirror shield.', () => {
    service.incrementShield();
    service.incrementShield();
    service.incrementShield();
    expect( service.shield ).toBe( Shield.Mirror );
  });

  it( 'can cycle four times to lose the shield.', () => {
    service.incrementShield();
    service.incrementShield();
    service.incrementShield();
    service.incrementShield();
    expect( service.shield ).toBe( Shield.None );
  });

  it( 'should start with the green tunic.', () => {
    expect( service.tunic ).toBe( Tunic.Green );
  });

  it( 'can cycle once to the blue tunic.', () => {
    service.incrementTunic();
    expect( service.tunic ).toBe( Tunic.Blue );
  });

  it( 'can cycle twice to the red tunic.', () => {
    service.incrementTunic();
    service.incrementTunic();
    expect( service.tunic ).toBe( Tunic.Red );
  });

  it( 'can cycle three times back to the green tunic.', () => {
    service.incrementTunic();
    service.incrementTunic();
    service.incrementTunic();
    expect( service.tunic ).toBe( Tunic.Green );
  });
} );
