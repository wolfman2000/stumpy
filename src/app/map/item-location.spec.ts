import { ItemLocation } from './item-location';
import { Availability } from './availability';

describe( 'A generic item location', () => {
  let itemLocation: ItemLocation;

  beforeEach( () => {
    itemLocation = new ItemLocation( 'Generic Location', 'Nothing yet', 40, 20.5 );
  });

  it( 'can have its name validated.', () => {
    expect( itemLocation.name ).toBe( 'Generic Location');
  });

  it( 'starts off as not claimed normally.', () => {
    expect( itemLocation.isOpened ).toBeFalsy();
  });

  it( 'can be claimed later, indicating that it is opened.', () => {
    itemLocation.toggleOpened();

    expect( itemLocation.isOpened ).toBeTruthy();
  });

  it( 'can be toggled back to unclaimed due to mismarks.', () => {
    itemLocation.toggleOpened();
    itemLocation.toggleOpened();

    expect( itemLocation.isOpened ).toBeFalsy();
  });
} );
