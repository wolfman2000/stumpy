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
  ], [
    Location.PalaceOfDarkness, new DungeonLocation(
      'Palace of Darkness',
      'lantern + bow',
      94,
      40
    )
  ], [
    Location.SwampPalace, new DungeonLocation(
      'Swamp Palace',
      'mirror + flippers',
      47,
      91
    )
  ], [
    Location.SkullWoods, new DungeonLocation(
      'Skull Woods',
      '',
      6.6,
      5.4
    )
  ], [
    Location.ThievesTown, new DungeonLocation(
      'Thieves Town',
      '',
      12.8,
      47.9
    )
  ], [
    Location.IcePalace, new DungeonLocation(
      'Ice Palace',
      '',
      79.6,
      85.8
    )
  ], [
    Location.MiseryMire, new DungeonLocation(
      'Misery Mire',
      'lantern + medallion',
      11.6,
      82.9
    )
  ], [
    Location.TurtleRock, new DungeonLocation(
      'Turtle Rock',
      'lantern + medallion',
      93.8,
      7
    )
  ] ]
);
