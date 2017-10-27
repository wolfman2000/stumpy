import { DungeonLocation } from './dungeon-location';
import { Location } from '../../dungeon/location';

export const DungeonLocations: Map<Location, DungeonLocation> = new Map<Location, DungeonLocation>(
  [ [
    Location.AgahnimTower, new DungeonLocation(
      'Agahnim\'s Tower',
      'master sword or cape + sword',
      50,
      52.6
    )
  ], [
    Location.EasternPalace, new DungeonLocation(
      'Eastern Palace',
      'lantern',
      94.6,
      38.8
    )
  ], [
    Location.DesertPalace, new DungeonLocation(
      'Desert Palace',
      'book or titans + mirror',
      7.6,
      78.4
    )
  ], [
    Location.TowerOfHera, new DungeonLocation(
      'Tower of Hera',
      '',
      62,
      5.5
    )
  ]]
);
