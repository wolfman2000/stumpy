import { ItemLocation } from './item-location';
import { LocationKey } from './location-key';

export const ItemLocations: Map<LocationKey, ItemLocation> = new Map<LocationKey, ItemLocation>(
  [[
    LocationKey.KingsTomb, new ItemLocation(
      'King\'s Tomb',
      'boots and titans or mirror',
      59.5,
      27
    )
  ], [
    LocationKey.LightWorldSwamp, new ItemLocation(
      'Light World Swamp',
      '',
      45,
      91
    )
  ], [
    LocationKey.LinksHouse, new ItemLocation(
      'Link\'s House',
      '',
      52.5,
      65.3
    )
  ], [
    LocationKey.SpiralCave, new ItemLocation(
      'Spiral Cave',
      'East Death Mountain Access',
      77.9,
      6.6
    )
  ], [
    LocationKey.MimicCave, new ItemLocation(
      'Mimic Cave',
      'mirror',
      83,
      6.6
    )
  ], [
    LocationKey.Tavern, new ItemLocation(
      'Tavern',
      '',
      13.6,
      55.4
    )
  ], [
    LocationKey.ChickenHouse, new ItemLocation(
      'Chicken House',
      'bombs',
      6.5,
      51.6
    )
  ], [
    LocationKey.AginahsCave, new ItemLocation(
      'Aginah\'s Cave',
      'bombs',
      17.2,
      80
    )
  ], [
    LocationKey.SahasrahlasHut, new ItemLocation(
      'Sahasrahla\'s Hut',
      '',
      79.4,
      39
    )
  ], [
    LocationKey.KakarikoWell, new ItemLocation(
      'Kakariko Well',
      'bombs for one',
      0.7,
      39
    )
  ], [
    LocationKey.BlindsHut, new ItemLocation(
      'Blind\'s Hut',
      'bombs for one',
      10.8,
      38.4
    )
  ], [
    LocationKey.ParadoxCave, new ItemLocation(
      'Paradox Cave',
      'bombs for two',
      80.6,
      14.6
    )
  ], [
    LocationKey.BonkRocks, new ItemLocation(
      'Bonk Rocks',
      'boots',
      36.5,
      26.7
    )
  ], [
    LocationKey.MiniMoldormCave, new ItemLocation(
      'Minimoldorm Cave',
      'bombs',
      63,
      91
    )
  ], [
    LocationKey.IceRodCave, new ItemLocation(
      'Ice Rod Cave',
      'bombs',
      87,
      74.4
    )
  ], [
    LocationKey.BottleVendor, new ItemLocation(
      'Bottle Vendor',
      '100 rupees',
      6.5,
      45
    )
  ], [
    LocationKey.SahasrahlasReward, new ItemLocation(
      'Sahasrahla',
      'Green Pendant',
      79.4,
      44.4
    )
  ], [
    LocationKey.SickKid, new ItemLocation(
      'Sick kid',
      'at least one bottle',
      13,
      49.4
    )
  ], [
    LocationKey.BridgeHideout, new ItemLocation(
      'Hideout under the bridge',
      'flippers',
      68.8,
      67
    )
  ], [
    LocationKey.EtherTablet, new ItemLocation(
      'Ether Tablet',
      'master sword and book',
      40,
      0.2
    )
  ], [
    LocationKey.BombosTablet, new ItemLocation(
      'Bombos Tablet',
      'master sword and book',
      20,
      90
    )
  ], [
    LocationKey.KingZora, new ItemLocation(
      'King Zora',
      '500 rupees',
      94,
      10
    )
  ], [
    LocationKey.LostOldMan, new ItemLocation(
      'Lost Old Man',
      'lantern',
      39.3,
      18
    )
  ], [
    LocationKey.PotionShop, new ItemLocation(
      'Witch outside Potion Shop',
      'mushroom',
      79.7,
      30
    )
  ], [
    LocationKey.ForestHideout, new ItemLocation(
      'Forest Hideout',
      '',
      16,
      10.5
    )
  ], [
    LocationKey.LumberjackTree, new ItemLocation(
      'Lumberjack Tree',
      'agahnim and boots',
      27.7,
      5
    )
  ], [
    LocationKey.SpectacleRockCave, new ItemLocation(
      'Spectacle Rock Cave',
      'glove & lamp',
      46,
      12
    )
  ], [
    LocationKey.MirrorCave, new ItemLocation(
      'South of Grove (Mirror Cave)',
      'mirror',
      26,
      81
    )
  ], [
    LocationKey.GraveyardCliffCave, new ItemLocation(
      'Graveyard Cliff Cave',
      'mirror',
      54,
      24
    )
  ], [
    LocationKey.CheckerboardCave, new ItemLocation(
      'Checkerboard Cave',
      'mirror',
      15,
      74.5
    )
  ], [
    LocationKey.Library, new ItemLocation(
      'Library',
      'boots',
      13,
      63
    )
  ], [
    LocationKey.Mushroom, new ItemLocation(
      'Mushroom',
      '',
      9.7,
      6.3
    )
  ], [
    LocationKey.SpectacleRock, new ItemLocation(
      'Spectacle Rock',
      'mirror',
      49,
      6
    )
  ], [
    LocationKey.FloatingIsland, new ItemLocation(
      'Floating Island',
      'mirror',
      78,
      0.2
    )
  ], [
    LocationKey.RaceMinigame, new ItemLocation(
      'Race minigame',
      'bombs or boots',
      1,
      68
    )
  ], [
    LocationKey.DesertWestLedge, new ItemLocation(
      'Desert West Ledge',
      'book or mirror',
      1,
      88
    )
  ], [
    LocationKey.LakeHyliaIsland, new ItemLocation(
      'Lake Hylia Island',
      'mirror',
      70,
      81
    )
  ], [
    LocationKey.ZoraLedge, new ItemLocation(
      'Zora River Ledge',
      'flippers',
      94,
      15
    )
  ], [
    LocationKey.BuriedItem, new ItemLocation(
      'Buried Item',
      'shovel',
      26,
      64
    )
  ], [
    LocationKey.SewerEscapeSideRoom, new ItemLocation(
      'Escape Sewer Side Room',
      'bomb or boots',
      52,
      29.5
    )
  ], [
    LocationKey.CastleSecretEntrance, new ItemLocation(
      'Castle Secret Entrance',
      '',
      58,
      40
    )
  ], [
    LocationKey.CastleDungeon, new ItemLocation(
      'Hyrule Castle Dungeon',
      '',
      48,
      42
    )
  ], [
    LocationKey.Sanctuary, new ItemLocation(
      'Sanctuary',
      '',
      44,
      25
    )
  ], [
    LocationKey.MadBatter, new ItemLocation(
      'Mad Batter',
      'hammer or mirror, plus powder',
      30,
      55
    )
  ], [
    LocationKey.DwarfEscort, new ItemLocation(
      'Take the dwarf/frog home',
      'mirror or Save and Quit',
      28,
      49
    )
  ] , [
    LocationKey.MasterSwordPedestal, new ItemLocation(
      'Master Sword Pedestal',
      'pendants',
      3,
      0.2
    )
  ], [
    LocationKey.SewerEscapeDarkRoom, new ItemLocation(
      'Escape Sewer Dark Room',
      'lantern',
      49,
      36
    )
  ], [
    LocationKey.WaterfallOfWishing, new ItemLocation(
      'Waterfall of Wishing',
      'flippers',
      88,
      13
    )
  ] ]
);
