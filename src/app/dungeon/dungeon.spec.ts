import { Dungeon } from './dungeon';
import { EntranceLock } from './entrance-lock';
import { Reward } from './reward';

describe( 'A dungeon with no chests of randomized items and no entrance lock', () => {
  let dungeon: Dungeon;

  beforeEach( () => { dungeon = new Dungeon('random location', 'random name', Reward.Unknown, 0); });

  it( 'has a max chest count of zero forever.', () => {
    expect( dungeon.maxChests ).toEqual( 0 );
  });

  it( 'has a count of zero chests at the start.', () => {
    expect( dungeon.chestCount ).toEqual( 0 );
  });

  it( 'starts with no entrance lock.', () => {
    expect( dungeon.entranceLock ).toBe( EntranceLock.None );
  });

  it( 'cannot have its chest count decremented.', () => {
    dungeon.decrementChestCount();

    expect( dungeon.chestCount ).toEqual( 0 );
  });

  it( 'cannot have its entrance requirement changed.', () => {
    dungeon.cycleEntranceLock();

    expect( dungeon.entranceLock ).toBe( EntranceLock.None );
  });
});

describe( 'A dungeon with two items inside', () => {
  let dungeon: Dungeon;

  beforeEach( () => { dungeon = new Dungeon('random location', 'random name', Reward.Unknown, 2); });

  it( 'starts with a count of two chests available.', () => {
    expect( dungeon.chestCount ).toEqual( 2 );
  });

  it( 'can have an item taken from the dungeon, updating its counts correctly.', () => {
    dungeon.decrementChestCount();

    expect( dungeon.chestCount ).toEqual( 1 );
    expect( dungeon.maxChests ).toEqual( 2 );
  });

  it( 'can have both items taken from the dungeon, updating its counts correctly.', () => {
    dungeon.decrementChestCount();
    dungeon.decrementChestCount();

    expect( dungeon.chestCount ).toEqual( 0 );
    expect( dungeon.maxChests ).toEqual( 2 );
  });

  it( 'can have both items put back into the dungeon, updating its counts correctly.', () => {
    dungeon.decrementChestCount();
    dungeon.decrementChestCount();
    dungeon.decrementChestCount();

    expect( dungeon.chestCount ).toEqual( 2 );
    expect( dungeon.maxChests ).toEqual( 2 );
  });
});

describe( 'A dungeon with a medallion lock', () => {
  let dungeon: Dungeon;

  beforeEach( () => { dungeon = new Dungeon('random location', 'random name', Reward.Unknown, 0, EntranceLock.Unknown); });

  it( 'starts in the unknown phase', () => {
    expect( dungeon.entranceLock ).toBe( EntranceLock.Unknown );
  });

  it( 'can be cycled to Bombos through one call.', () => {
    dungeon.cycleEntranceLock();

    expect( dungeon.entranceLock ).toBe( EntranceLock.Bombos );
  });

  it( 'can be cycled to Ether through two calls.', () => {
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();

    expect( dungeon.entranceLock ).toBe( EntranceLock.Ether );
  });

  it( 'can be cycled to Quake through three calls.', () => {
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();

    expect( dungeon.entranceLock ).toBe( EntranceLock.Quake );
  });

  it( 'cycles back to being unknown after four calls.', () => {
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();
    dungeon.cycleEntranceLock();

    expect( dungeon.entranceLock ).toBe( EntranceLock.Unknown );
  });
});
