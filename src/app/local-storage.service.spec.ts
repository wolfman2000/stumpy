import { LocalStorageService } from './local-storage.service';

describe( 'The local storage service', () => {
  let service: LocalStorageService;

  beforeAll(() => {
    service = new LocalStorageService();
  });

  beforeEach(() => {
    const store: any = {};

    spyOn( localStorage, 'getItem' ).and.callFake( (key: string): string => {
      return store[key] || null;
    });

    spyOn( localStorage, 'removeItem' ).and.callFake( (key: string): void => {
      delete store[key];
    });

    spyOn( localStorage, 'setItem' ).and.callFake( (key: string, value: string): void => {
      store[key] = value;
    });
  });

  it( 'should start with nothing inside.', () => {
    expect( service.hasItem('foo')).toBeFalsy();
  });

  it( 'should be able to set an item, and get that same item.', () => {
    service.setItem( 'foo', 'bar' );
    expect( service.getItem( 'foo' )).toBe('bar');

    expect( service.hasItem('foo')).toBeTruthy();
  });

  it( 'should be able to set, then remove the item put in.', () => {
    service.setItem( 'foo', 'bar' );
    service.removeItem( 'foo' );

    expect( service.hasItem('foo')).toBeFalsy();
  });
});
