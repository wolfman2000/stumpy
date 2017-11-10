import { Item } from './item';
import { ItemKey } from './item-key';

export const Items = new Map<ItemKey, Item>(
  [ [
    ItemKey.Bow, new Item(
      'Bow',
      [false, true],
      ['bow', 'bow']
    )
  ], [
    ItemKey.SilverArrows, new Item(
      'Silver Arrows',
      [false, true],
      ['silver-arrows', 'silver-arrows']
    )
  ], [
    ItemKey.Boomerangs, new Item(
      'Boomerangs',
      [false, true, true, true],
      ['boomerang1', 'boomerang1', 'boomerang2', 'boomerang3']
    )
  ], [
    ItemKey.Hookshot, new Item(
      'Hookshot',
      [false, true],
      ['hookshot', 'hookshot']
    )
  ], [
    ItemKey.Mushroom, new Item(
      'Mushroom',
      [false, true],
      ['mushroom', 'mushroom']
    )
  ], [
    ItemKey.Powder, new Item(
      'Powder',
      [false, true],
      ['powder', 'powder']
    )
  ], [
    ItemKey.Boots, new Item(
      'Boots',
      [false, true],
      ['boots', 'boots']
    )
  ], [
    ItemKey.Glove, new Item(
      'Gloves',
      [false, true, true],
      ['glove1', 'glove1', 'glove2']
    )
  ], [
    ItemKey.Flippers, new Item(
      'Flippers',
      [false, true],
      ['flippers', 'flippers']
    )
  ], [
    ItemKey.MoonPearl, new Item(
      'Moon Pearl',
      [false, true],
      ['moonPearl', 'moonPearl']
    )
  ], [
    ItemKey.FireRod, new Item(
      'Fire Rod',
      [false, true],
      ['firerod', 'firerod']
    )
  ], [
    ItemKey.IceRod, new Item(
      'Ice Rod',
      [false, true],
      ['icerod', 'icerod']
    )
  ], [
    ItemKey.Bombos, new Item(
      'Bombos',
      [false, true],
      ['bombos', 'bombos']
    )
  ], [
    ItemKey.Ether, new Item(
      'Ether',
      [false, true],
      ['ether', 'ether']
    )
  ], [
    ItemKey.Quake, new Item(
      'Quake',
      [false, true],
      ['quake', 'quake']
    )
  ], [
    ItemKey.Lantern, new Item(
      'Lantern',
      [false, true],
      ['lantern', 'lantern']
    )
  ], [
    ItemKey.Somaria, new Item(
      'Cane of Somaria',
      [false, true],
      ['somaria', 'somaria']
    )
  ], [
    ItemKey.Byrna, new Item(
      'Cane of Byrna',
      [false, true],
      ['byrna', 'byrna']
    )
  ], [
    ItemKey.Cape, new Item(
      'Magic Cape',
      [false, true],
      ['cape', 'cape']
    )
  ], [
    ItemKey.Mirror, new Item(
      'Magic Mirror',
      [false, true],
      ['mirror', 'mirror']
    )
  ], [
    ItemKey.Bottle, new Item(
      'Bottle',
      [false, true, true, true, true],
      ['bottle0', 'bottle1', 'bottle2', 'bottle3', 'bottle4']
    )
  ], [
    ItemKey.Hammer, new Item(
      'Hammer',
      [false, true],
      ['hammer', 'hammer']
    )
  ], [
    ItemKey.Shovel, new Item(
      'Shovel',
      [false, true],
      ['shovel', 'shovel']
    )
  ], [
    ItemKey.Flute, new Item(
      'Flute',
      [false, true],
      ['flute', 'flute']
    )
  ], [
    ItemKey.Net, new Item(
      'Net',
      [false, true],
      ['net', 'net']
    )
  ], [
    ItemKey.Book, new Item(
      'Book of Mudora',
      [false, true],
      ['book', 'book']
    )
  ], [
    ItemKey.Sword, new Item(
      'Sword',
      [false, true, true, true, true],
      ['sword1', 'sword1', 'sword2', 'sword3', 'sword4']
    )
  ], [
    ItemKey.Shield, new Item(
      'Shield',
      [false, true, true, true],
      ['shield1', 'shield1', 'shield2', 'shield3']
    )
  ], [
    ItemKey.Tunic, new Item(
      'Tunic',
      [true, true, true],
      ['tunic1', 'tunic2', 'tunic3']
    )
  ], [
    ItemKey.Bomb, new Item(
      'Bomb',
      [false, true],
      ['bomb', 'bomb']
    )
  ], [
    ItemKey.Magic, new Item(
      'Magic Upgrade',
      [false, true, true],
      ['magic1', 'magic1', 'magic2']
    )
  ] ]
);
