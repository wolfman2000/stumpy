import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BombosComponent } from './bombos/bombos.component';
import { BookComponent } from './book/book.component';
import { BoomerangComponent } from './boomerang/boomerang.component';
import { BootsComponent } from './boots/boots.component';
import { BottleComponent } from './bottle/bottle.component';
import { BowComponent } from './bow/bow.component';
import { ByrnaComponent } from './byrna/byrna.component';
import { CapeComponent } from './cape/cape.component';
import { EtherComponent } from './ether/ether.component';
import { FireRodComponent } from './firerod/firerod.component';
import { FlippersComponent } from './flippers/flippers.component';
import { FluteComponent } from './flute/flute.component';
import { GloveComponent } from './glove/glove.component';
import { HammerComponent } from './hammer/hammer.component';
import { HookshotComponent } from './hookshot/hookshot.component';
import { IceRodComponent } from './icerod/icerod.component';
import { LanternComponent } from './lantern/lantern.component';
import { MirrorComponent } from './mirror/mirror.component';
import { MoonPearlComponent } from './moon-pearl/moon-pearl.component';
import { MushroomComponent } from './mushroom/mushroom.component';
import { NetComponent } from './net/net.component';
import { PowderComponent } from './powder/powder.component';
import { QuakeComponent } from './quake/quake.component';
import { ShieldComponent } from './shield/shield.component';
import { ShovelComponent } from './shovel/shovel.component';
import { SilverArrowsComponent } from './silver-arrows/silver-arrows.component';
import { SomariaComponent } from './somaria/somaria.component';
import { SwordComponent } from './sword/sword.component';
import { TunicComponent } from './tunic/tunic.component';
import { ItemComponent } from './item.component';

const components: any = [
  BombosComponent,
  BookComponent,
  BoomerangComponent,
  BootsComponent,
  BottleComponent,
  BowComponent,
  ByrnaComponent,
  CapeComponent,
  EtherComponent,
  FireRodComponent,
  FlippersComponent,
  FluteComponent,
  GloveComponent,
  HammerComponent,
  HookshotComponent,
  IceRodComponent,
  LanternComponent,
  MirrorComponent,
  MoonPearlComponent,
  MushroomComponent,
  NetComponent,
  PowderComponent,
  QuakeComponent,
  ShieldComponent,
  ShovelComponent,
  SilverArrowsComponent,
  SomariaComponent,
  SwordComponent,
  TunicComponent,
  ItemComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: components,
  exports: components
})

export class ItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ItemModule,
      providers: []
    };
  }
}
