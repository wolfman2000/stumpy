import { WorldId } from './world-id';
import { World } from './world';

export const Worlds = new Map<WorldId, World>(
  [ [
    WorldId.Light, new World(
      'light',
      Array.from({ length: 48 }, (v, k) => k + 0),
      Array.from({ length: 4}, (v, k) => k + 0)
    )
  ], [
    WorldId.Dark, new World(
      'dark',
      Array.from({length: 17}, (v, k) => k + 48),
      Array.from( {length: 7}, (v, k) => k + 4)
    )
  ] ]
);
