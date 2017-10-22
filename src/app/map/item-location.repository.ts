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
  ]]
);
