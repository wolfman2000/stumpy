import { ItemLocation } from './item-location';
import { LocationKey } from './location-key';

export const ItemLocations: Map<LocationKey, ItemLocation> = new Map<LocationKey, ItemLocation>(
  [[
    LocationKey.KingsTomb, new ItemLocation(
      'King\'s Tomb',
      'boots and titans or mirror',
      61.6,
      29.6
    )
  ], [
    LocationKey.LightWorldSwamp, new ItemLocation(
      'Light World Swamp',
      '',
      46.8,
      93.4
    )
  ], [
    LocationKey.LinksHouse, new ItemLocation(
      'Link\'s House',
      '',
      54.8,
      67.9
    )
  ], [
    LocationKey.SpiralCave, new ItemLocation(
      'Spiral Cave',
      'East Death Mountain Access',
      79.8,
      9.3
    )
  ], [
    LocationKey.MimicCave, new ItemLocation(
      'Mimic Cave',
      'mirror',
      85.2,
      9.3
    )
  ], [
    LocationKey.Tavern, new ItemLocation(
      'Tavern',
      '',
      16.2,
      57.8
    )
  ], [
    LocationKey.ChickenHouse, new ItemLocation(
      'Chicken House',
      'bombs',
      8.8,
      54.2
    )
  ], [
    LocationKey.AginahsCave, new ItemLocation(
      'Aginah\'s Cave',
      'bombs',
      20,
      82.6
    )
  ], [
    LocationKey.SahasrahlasHut, new ItemLocation(
      'Sahasrahla\'s Hut',
      '',
      81.4,
      41.4
    )
  ], [
    LocationKey.KakarikoWell, new ItemLocation(
      'Kakariko Well',
      'bombs for one',
      3,
      41
    )
  ], [
    LocationKey.BlindsHut, new ItemLocation(
      'Blind\'s Hut',
      'bombs for one',
      12.8,
      41
    )
  ], [
    LocationKey.ParadoxCave, new ItemLocation(
      'Paradox Cave',
      'bombs for two',
      82.8,
      17.1
    )
  ], [
    LocationKey.BonkRocks, new ItemLocation(
      'Bonk Rocks',
      'boots',
      39,
      29.3
    )
  ], [
    LocationKey.MiniMoldormCave, new ItemLocation(
      'Minimoldorm Cave',
      'bombs',
      65.2,
      93.4
    )
  ], [
    LocationKey.IceRodCave, new ItemLocation(
      'Ice Rod Cave',
      'bombs',
      89.2,
      76.9
    )
  ], [
    LocationKey.BottleVendor, new ItemLocation(
      'Bottle Vendor',
      '100 rupees',
      9,
      46.8
    )
  ], [
    LocationKey.SahasrahlasReward, new ItemLocation(
      'Sahasrahla',
      'Green Pendant',
      81.4,
      46.7
    )
  ], [
    LocationKey.SickKid, new ItemLocation(
      'Sick kid',
      'at least one bottle',
      15.6,
      52.1
    )
  ], [
    LocationKey.BridgeHideout, new ItemLocation(
      'Hideout under the bridge',
      'flippers',
      70.8,
      69.7
    )
  ], [
    LocationKey.EtherTablet, new ItemLocation(
      'Ether Tablet',
      'master sword and book',
      42,
      3
    )
  ], [
    LocationKey.BombosTablet, new ItemLocation(
      'Bombos Tablet',
      'master sword and book',
      22,
      92.2
    )
  ], [
    LocationKey.KingZora, new ItemLocation(
      'King Zora',
      '500 rupees',
      96,
      12.1
    )
  ], [
    LocationKey.LostOldMan, new ItemLocation(
      'Lost Old Man',
      'lantern',
      41.6,
      20.4
    )
  ], [
    LocationKey.PotionShop, new ItemLocation(
      'Witch outside Potion Shop',
      'mushroom',
      81.6,
      32.5
    )
  ], [
    LocationKey.ForestHideout, new ItemLocation(
      'Forest Hideout',
      '',
      18.8,
      13
    )
  ], [
    LocationKey.LumberjackTree, new ItemLocation(
      'Lumberjack Tree',
      'agahnim and boots',
      30.4,
      7.6
    )
  ], [
    LocationKey.SpectacleRockCave, new ItemLocation(
      'Spectacle Rock Cave',
      'glove & lamp',
      48.6,
      14.8
    )
  ], [
    LocationKey.MirrorCave, new ItemLocation(
      'South of Grove (Mirror Cave)',
      'mirror',
      28.2,
      84.1
    )
  ], [
    LocationKey.GraveyardCliffCave, new ItemLocation(
      'Graveyard Cliff Cave',
      'mirror',
      56.2,
      27
    )
  ], [
    LocationKey.CheckerboardCave, new ItemLocation(
      'Checkerboard Cave',
      'mirror',
      17.6,
      77.3
    )
  ], [
    LocationKey.Library, new ItemLocation(
      'Library',
      'boots',
      15.4,
      65.9
    )
  ], [
    LocationKey.Mushroom, new ItemLocation(
      'Mushroom',
      '',
      12.4,
      8.6
    )
  ], [
    LocationKey.SpectacleRock, new ItemLocation(
      'Spectacle Rock',
      'mirror',
      50.8,
      8.5
    )
  ], [
    LocationKey.FloatingIsland, new ItemLocation(
      'Floating Island',
      'mirror',
      80.4,
      3
    )
  ], [
    LocationKey.RaceMinigame, new ItemLocation(
      'Race minigame',
      'bombs or boots',
      3.6,
      69.8
    )
  ], [
    LocationKey.DesertWestLedge, new ItemLocation(
      'Desert West Ledge',
      'book or mirror',
      3,
      91
    )
  ], [
    LocationKey.LakeHyliaIsland, new ItemLocation(
      'Lake Hylia Island',
      'mirror',
      72.2,
      82.9
    )
  ], [
    LocationKey.ZoraLedge, new ItemLocation(
      'Zora River Ledge',
      'flippers',
      95.4,
      17.3
    )
  ], [
    LocationKey.BuriedItem, new ItemLocation(
      'Buried Item',
      'shovel',
      28.8,
      66.2
    )
  ], [
    LocationKey.SewerEscapeSideRoom, new ItemLocation(
      'Escape Sewer Side Room',
      'bomb or boots',
      53.6,
      32.4
    )
  ], [
    LocationKey.CastleSecretEntrance, new ItemLocation(
      'Castle Secret Entrance',
      '',
      59.6,
      41.8
    )
  ], [
    LocationKey.CastleDungeon, new ItemLocation(
      'Hyrule Castle Dungeon',
      '',
      50,
      44.1
    )
  ], [
    LocationKey.Sanctuary, new ItemLocation(
      'Sanctuary',
      '',
      46,
      28
    )
  ], [
    LocationKey.MadBatter, new ItemLocation(
      'Mad Batter',
      'hammer or mirror, plus powder',
      32,
      58
    )
  ], [
    LocationKey.DwarfEscort, new ItemLocation(
      'Take the dwarf/frog home',
      'mirror or Save and Quit',
      30.4,
      51.8
    )
  ] , [
    LocationKey.MasterSwordPedestal, new ItemLocation(
      'Master Sword Pedestal',
      'pendants',
      5,
      3.2
    )
  ], [
    LocationKey.SewerEscapeDarkRoom, new ItemLocation(
      'Escape Sewer Dark Room',
      'lantern',
      51.2,
      38.2
    )
  ], [
    LocationKey.WaterfallOfWishing, new ItemLocation(
      'Waterfall of Wishing',
      'flippers',
      89.8,
      14.7
    )
  ], [
    LocationKey.BombableHut, new ItemLocation(
      'Bombable Hut',
      'bombs',
      10.8,
      57.8
    )
  ], [
    LocationKey.CShapedHouse, new ItemLocation(
      'C-Shaped House',
      '',
      21.6,
      47.9
    )
  ], [
    LocationKey.MireHut, new ItemLocation(
      'Mire Hut',
      'mirror and titan',
      3.4,
      79.5
    )
  ], [
    LocationKey.SuperBunnyCave, new ItemLocation(
      'SuperBunny Cave',
      'titan',
      85.6,
      14.7
    )
  ], [
    LocationKey.SpikeCave, new ItemLocation(
      'Spike Cave',
      'cape or byrna',
      57.2,
      14.9
    )
  ], [
    LocationKey.HypeCave, new ItemLocation(
      'Hype Cave',
      'bombs',
      60,
      77.1
    )
  ], [
    LocationKey.HookshotCaveBottom, new ItemLocation(
      'Hookshot Cave (Boots Accessible)',
      'hookshot or boots',
      83.2,
      8.6
    )
  ], [
    LocationKey.HookshotCaveTop, new ItemLocation(
      'Hookshot Cave (Not Boots Accessible)',
      'hookshot',
      83.2,
      3.4
    )
  ], [
    LocationKey.TreasureChestMinigame, new ItemLocation(
      'Treasure Chest Mini-game',
      '',
      4.2,
      46.4
    )
  ], [
    LocationKey.StumpKid, new ItemLocation(
      'Stump Kid',
      '',
      31,
      68.6
    )
  ], [
    LocationKey.PurpleChest, new ItemLocation(
      'Purple Chest',
      '',
      30.4,
      52.2
    )
  ], [
    LocationKey.Catfish, new ItemLocation(
      'Catfish',
      '',
      92,
      17.2
    )
  ], [
    LocationKey.HammerPegCave, new ItemLocation(
      'Hammer Peg Cave',
      'hammer and titan',
      31.6,
      60.1
    )
  ], [
    LocationKey.BumperCave, new ItemLocation(
      'Bumper Cave',
      'cave',
      34.2,
      15.2
    )
  ], [
    LocationKey.Pyramid, new ItemLocation(
      'Pyramid Ledge',
      '',
      58,
      43.5
    )
  ], [
    LocationKey.DiggingGame, new ItemLocation(
      'Digging Minigame',
      '',
      5.8,
      69.2
    )
  ], [
    LocationKey.PyramidFairy, new ItemLocation(
      'Pyramid Fairy',
      'Crystals 5 and 6',
      47,
      48.5
    )
  ] ]
);
