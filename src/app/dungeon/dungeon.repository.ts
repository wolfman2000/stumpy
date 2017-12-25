import { Dungeon } from './dungeon';
import { EntranceLock } from './entrance-lock';
import { Location } from './location';
import { Reward } from './reward';

export const Dungeons = new Map<Location, Dungeon>(
  [ [
    Location.CastleTower, new Dungeon(
      Location.CastleTower,
      'CT',
      'Agahnim\'s Tower',
      'Agahnim',
      Reward.None,
      0
    )
  ], [
    Location.EasternPalace, new Dungeon(
      Location.EasternPalace,
      'EP',
      'Eastern Palace',
      'Armos Knights',
      Reward.Unknown,
      3
    )
  ], [
    Location.DesertPalace, new Dungeon(
      Location.DesertPalace,
      'DP',
      'Desert Palace',
      'Lanmolas',
      Reward.Unknown,
      2
    )
  ], [
    Location.TowerOfHera, new Dungeon(
      Location.TowerOfHera,
      'ToH',
      'Tower of Hera',
      'Moldorm',
      Reward.Unknown,
      2
    )
  ], [
    Location.PalaceOfDarkness, new Dungeon(
      Location.PalaceOfDarkness,
      'PoD',
      'Palace of Darkness',
      'Helmasaur King',
      Reward.Unknown,
      5
    )
  ], [
    Location.SwampPalace, new Dungeon(
      Location.SwampPalace,
      'SP',
      'Swamp Palace',
      'Arrghus',
      Reward.Unknown,
      6
    )
  ], [
    Location.SkullWoods, new Dungeon(
      Location.SkullWoods,
      'SW',
      'Skull Woods',
      'Mothula',
      Reward.Unknown,
      2
    )
  ], [
    Location.ThievesTown, new Dungeon(
      Location.ThievesTown,
      'TT',
      'Thieves Town',
      'Blind',
      Reward.Unknown,
      4
    )
  ], [
    Location.IcePalace, new Dungeon(
      Location.IcePalace,
      'IP',
      'Ice Palace',
      'Kholdstare',
      Reward.Unknown,
      3
    )
  ], [
    Location.MiseryMire, new Dungeon(
      Location.MiseryMire,
      'MM',
      'Misery Mire',
      'Vitreous',
      Reward.Unknown,
      2,
      EntranceLock.Unknown
    )
  ], [
    Location.TurtleRock, new Dungeon(
      Location.TurtleRock,
      'TR',
      'Turtle Rock',
      'Trinexx',
      Reward.Unknown,
      5,
      EntranceLock.Unknown
    )
  ], [
    Location.GanonsTower, new Dungeon(
      Location.GanonsTower,
      'GT',
      'Ganon\'s Tower',
      'Agahnim 2',
      Reward.None,
      0
    )
  ] ]
);
