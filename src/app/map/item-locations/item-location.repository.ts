import { ItemLocation } from './item-location';
import { LocationKey } from './location-key';
import { LocationType } from '../location-type';

export const ItemLocations = new Map<LocationKey, ItemLocation>(
  [[
    LocationKey.KingsTomb, new ItemLocation(
      'King\'s Tomb',
      '{boots} and {glove2} or {mirror}',
      LocationType.Single,
      61.6,
      29.6
    )
  ], [
    LocationKey.LightWorldSwamp, new ItemLocation(
      'Light World Swamp',
      '',
      LocationType.Single,
      46.8,
      93.4
    )
  ], [
    LocationKey.LinksHouse, new ItemLocation(
      'Link\'s House',
      '',
      LocationType.Single,
      54.8,
      67.9
    )
  ], [
    LocationKey.SpiralCave, new ItemLocation(
      'Spiral Cave',
      'East Death Mountain Access',
      LocationType.Multiple,
      79.8,
      9.3
    )
  ], [
    LocationKey.MimicCave, new ItemLocation(
      'Mimic Cave',
      '{mirror}',
      LocationType.Single,
      85.2,
      9.3
    )
  ], [
    LocationKey.Tavern, new ItemLocation(
      'Tavern',
      '',
      LocationType.Single,
      16.2,
      57.8
    )
  ], [
    LocationKey.ChickenHouse, new ItemLocation(
      'Chicken House',
      '{bomb}',
      LocationType.Single,
      8.8,
      54.2
    )
  ], [
    LocationKey.AginahsCave, new ItemLocation(
      'Aginah\'s Cave',
      '{bomb}',
      LocationType.Single,
      20,
      82.6
    )
  ], [
    LocationKey.SahasrahlasHut, new ItemLocation(
      'Sahasrahla\'s Hut',
      '',
      LocationType.Single,
      81.4,
      41.4
    )
  ], [
    LocationKey.KakarikoWell, new ItemLocation(
      'Kakariko Well',
      '{bomb} for one',
      LocationType.Pit,
      3,
      41
    )
  ], [
    LocationKey.BlindsHut, new ItemLocation(
      'Blind\'s Hut',
      '{bomb} for one',
      LocationType.Single,
      12.8,
      41
    )
  ], [
    LocationKey.ParadoxCave, new ItemLocation(
      'Paradox Cave',
      '{bomb} for two',
      LocationType.Multiple,
      82.8,
      17.1
    )
  ], [
    LocationKey.BonkRocks, new ItemLocation(
      'Bonk Rocks',
      '{boots}',
      LocationType.Single,
      39,
      29.3
    )
  ], [
    LocationKey.MiniMoldormCave, new ItemLocation(
      'Minimoldorm Cave',
      '{bomb}',
      LocationType.Single,
      65.2,
      93.4
    )
  ], [
    LocationKey.IceRodCave, new ItemLocation(
      'Ice Rod Cave',
      '{bomb}',
      LocationType.Single,
      89.2,
      76.9
    )
  ], [
    LocationKey.BottleVendor, new ItemLocation(
      'Bottle Vendor',
      '100 rupees',
      LocationType.Outside,
      9,
      46.8
    )
  ], [
    LocationKey.SahasrahlasReward, new ItemLocation(
      'Sahasrahla',
      'Green Pendant',
      LocationType.Outside,
      81.4,
      46.7
    )
  ], [
    LocationKey.SickKid, new ItemLocation(
      'Sick kid',
      'at least one {bottle0}',
      LocationType.Single,
      15.6,
      52.1
    )
  ], [
    LocationKey.BridgeHideout, new ItemLocation(
      'Hideout under the bridge',
      '{flippers}',
      LocationType.Outside,
      70.8,
      69.7
    )
  ], [
    LocationKey.EtherTablet, new ItemLocation(
      'Ether Tablet',
      '{sword2} and {book}',
      LocationType.Outside,
      42,
      3
    )
  ], [
    LocationKey.BombosTablet, new ItemLocation(
      'Bombos Tablet',
      '{sword2} and {book}',
      LocationType.Outside,
      22,
      92.2
    )
  ], [
    LocationKey.KingZora, new ItemLocation(
      'King Zora',
      '500 rupees',
      LocationType.Outside,
      96,
      12.1
    )
  ], [
    LocationKey.LostOldMan, new ItemLocation(
      'Lost Old Man',
      '{lantern}',
      LocationType.Multiple,
      41.6,
      20.4
    )
  ], [
    LocationKey.PotionShop, new ItemLocation(
      'Witch outside Potion Shop',
      '{mushroom}',
      LocationType.Single,
      81.6,
      32.5
    )
  ], [
    LocationKey.ForestHideout, new ItemLocation(
      'Forest Hideout',
      '',
      LocationType.Pit,
      18.8,
      13
    )
  ], [
    LocationKey.LumberjackTree, new ItemLocation(
      'Lumberjack Tree',
      'agahnim and {boots}',
      LocationType.Pit,
      30.4,
      7.6
    )
  ], [
    LocationKey.SpectacleRockCave, new ItemLocation(
      'Spectacle Rock Cave',
      '{glove1} & {lantern}',
      LocationType.Multiple,
      48.6,
      14.8
    )
  ], [
    LocationKey.MirrorCave, new ItemLocation(
      'South of Grove (Mirror Cave)',
      '{mirror}',
      LocationType.Single,
      28.2,
      84.1
    )
  ], [
    LocationKey.GraveyardCliffCave, new ItemLocation(
      'Graveyard Cliff Cave',
      '{mirror}',
      LocationType.Single,
      56.2,
      27
    )
  ], [
    LocationKey.CheckerboardCave, new ItemLocation(
      'Checkerboard Cave',
      '{mirror}',
      LocationType.Single,
      17.6,
      77.3
    )
  ], [
    LocationKey.Library, new ItemLocation(
      'Library',
      '{boots}',
      LocationType.Single,
      15.4,
      65.9
    )
  ], [
    LocationKey.Mushroom, new ItemLocation(
      'Mushroom',
      '',
      LocationType.Outside,
      12.4,
      8.6
    )
  ], [
    LocationKey.SpectacleRock, new ItemLocation(
      'Spectacle Rock',
      '{mirror}',
      LocationType.Outside,
      50.8,
      8.5
    )
  ], [
    LocationKey.FloatingIsland, new ItemLocation(
      'Floating Island',
      '{mirror}',
      LocationType.Outside,
      80.4,
      3
    )
  ], [
    LocationKey.RaceMinigame, new ItemLocation(
      'Race minigame',
      '{bomb} or {boots}',
      LocationType.Outside,
      3.6,
      69.8
    )
  ], [
    LocationKey.DesertWestLedge, new ItemLocation(
      'Desert West Ledge',
      '{book} or {mirror}',
      LocationType.Outside,
      3,
      91
    )
  ], [
    LocationKey.LakeHyliaIsland, new ItemLocation(
      'Lake Hylia Island',
      '{mirror}',
      LocationType.Outside,
      72.2,
      82.9
    )
  ], [
    LocationKey.ZoraLedge, new ItemLocation(
      'Zora River Ledge',
      '{flippers}',
      LocationType.Outside,
      95.4,
      17.3
    )
  ], [
    LocationKey.BuriedItem, new ItemLocation(
      'Buried Item',
      '{shovel}',
      LocationType.Outside,
      28.8,
      66.2
    )
  ], [
    LocationKey.SewerEscapeSideRoom, new ItemLocation(
      'Escape Sewer Side Room',
      '{bomb} or {boots}',
      LocationType.Multiple,
      53.6,
      32.4
    )
  ], [
    LocationKey.CastleSecretEntrance, new ItemLocation(
      'Castle Secret Entrance',
      '',
      LocationType.Pit,
      59.6,
      41.8
    )
  ], [
    LocationKey.CastleDungeon, new ItemLocation(
      'Hyrule Castle Dungeon',
      '',
      LocationType.Multiple,
      50,
      44.1
    )
  ], [
    LocationKey.Sanctuary, new ItemLocation(
      'Sanctuary',
      '',
      LocationType.Multiple,
      46,
      28
    )
  ], [
    LocationKey.MadBatter, new ItemLocation(
      'Mad Batter',
      '{hammer} or {mirror}, plus {powder}',
      LocationType.Pit,
      33,
      56
    )
  ], [
    LocationKey.DwarfEscort, new ItemLocation(
      'Take the dwarf/frog home',
      '{mirror} or Save and Quit',
      LocationType.Outside,
      30.4,
      51.8
    )
  ] , [
    LocationKey.MasterSwordPedestal, new ItemLocation(
      'Master Sword Pedestal',
      'All Three Pendants',
      LocationType.Outside,
      5,
      3.2
    )
  ], [
    LocationKey.SewerEscapeDarkRoom, new ItemLocation(
      'Escape Sewer Dark Room',
      '{lantern}',
      LocationType.Multiple,
      51.2,
      38.2
    )
  ], [
    LocationKey.WaterfallOfWishing, new ItemLocation(
      'Waterfall of Wishing',
      '{flippers}',
      LocationType.Single,
      89.8,
      14.7
    )
  ], [
    LocationKey.BombableHut, new ItemLocation(
      'Bombable Hut',
      '{bomb}',
      LocationType.Single,
      10.8,
      57.8
    )
  ], [
    LocationKey.CShapedHouse, new ItemLocation(
      'C-Shaped House',
      '',
      LocationType.Single,
      21.6,
      47.9
    )
  ], [
    LocationKey.MireHut, new ItemLocation(
      'Mire Hut',
      '{mirror} and {glove2}',
      LocationType.Single,
      3.4,
      79.5
    )
  ], [
    LocationKey.SuperBunnyCave, new ItemLocation(
      'SuperBunny Cave',
      '{glove2}',
      LocationType.Multiple,
      85.6,
      14.7
    )
  ], [
    LocationKey.SpikeCave, new ItemLocation(
      'Spike Cave',
      '{cape} or {byrna}',
      LocationType.Single,
      57.2,
      14.9
    )
  ], [
    LocationKey.HypeCave, new ItemLocation(
      'Hype Cave',
      '{bomb}',
      LocationType.Single,
      60,
      77.1
    )
  ], [
    LocationKey.HookshotCaveBottom, new ItemLocation(
      'Hookshot Cave (Boots Accessible)',
      '{hookshot} or {boots}',
      LocationType.Multiple,
      83.2,
      8.6
    )
  ], [
    LocationKey.HookshotCaveTop, new ItemLocation(
      'Hookshot Cave (Not Boots Accessible)',
      '{hookshot}',
      LocationType.Multiple,
      83.2,
      3.4
    )
  ], [
    LocationKey.TreasureChestMinigame, new ItemLocation(
      'Treasure Chest Mini-game',
      '',
      LocationType.Single,
      4.2,
      46.4
    )
  ], [
    LocationKey.StumpKid, new ItemLocation(
      'Stump Kid',
      '',
      LocationType.Outside,
      31,
      68.6
    )
  ], [
    LocationKey.PurpleChest, new ItemLocation(
      'Purple Chest',
      '',
      LocationType.Outside,
      30.4,
      52.2
    )
  ], [
    LocationKey.Catfish, new ItemLocation(
      'Catfish',
      '',
      LocationType.Outside,
      92,
      17.2
    )
  ], [
    LocationKey.HammerPegCave, new ItemLocation(
      'Hammer Peg Cave',
      '{hammer} and {glove2}',
      LocationType.Single,
      31.6,
      60.1
    )
  ], [
    LocationKey.BumperCave, new ItemLocation(
      'Bumper Cave',
      '{cape}',
      LocationType.Multiple,
      34.2,
      15.2
    )
  ], [
    LocationKey.Pyramid, new ItemLocation(
      'Pyramid Ledge',
      '',
      LocationType.Outside,
      58,
      43.5
    )
  ], [
    LocationKey.DiggingGame, new ItemLocation(
      'Digging Minigame',
      '',
      LocationType.Outside,
      5.8,
      69.2
    )
  ], [
    LocationKey.PyramidFairy, new ItemLocation(
      'Pyramid Fairy',
      'Crystals 5 and 6',
      LocationType.Single,
      47,
      48.5
    )
  ] ]
);
