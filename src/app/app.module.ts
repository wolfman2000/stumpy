import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings.component';
import { RandomizerTrackerComponent } from './tracker.component';
import { SwordComponent } from './items/sword/sword.component';
import { BowComponent } from './items/bow/bow.component';
import { FireRodComponent } from './items/firerod/firerod.component';
import { IceRodComponent } from './items/icerod/icerod.component';
import { ShieldComponent } from './items/shield/shield.component';
import { BoomerangComponent } from './items/boomerang/boomerang.component';
import { HookshotComponent } from './items/hookshot/hookshot.component';
import { MushroomComponent } from './items/mushroom/mushroom.component';
import { PowderComponent } from './items/powder/powder.component';
import { BootsComponent } from './items/boots/boots.component';
import { GloveComponent } from './items/glove/glove.component';
import { FlippersComponent } from './items/flippers/flippers.component';
import { MoonPearlComponent } from './items/moon-pearl/moon-pearl.component';
import { BombosComponent } from './items/bombos/bombos.component';
import { EtherComponent } from './items/ether/ether.component';
import { QuakeComponent } from './items/quake/quake.component';
import { SomariaComponent } from './items/somaria/somaria.component';
import { ByrnaComponent } from './items/byrna/byrna.component';
import { CapeComponent } from './items/cape/cape.component';
import { MirrorComponent } from './items/mirror/mirror.component';
import { BottleComponent } from './items/bottle/bottle.component';
import { HammerComponent } from './items/hammer/hammer.component';
import { ShovelComponent } from './items/shovel/shovel.component';
import { FluteComponent } from './items/flute/flute.component';
import { NetComponent } from './items/net/net.component';
import { BookComponent } from './items/book/book.component';
import { TunicComponent } from './items/tunic/tunic.component';
import { SilverArrowsComponent } from './items/silver-arrows/silver-arrows.component';
import { LanternComponent } from './items/lantern/lantern.component';
import { DungeonComponent } from './dungeon/dungeon.component';
import { CamelCasePipe } from './camel-case.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerSettingsComponent,
    RandomizerTrackerComponent,
    SwordComponent,
    BowComponent,
    FireRodComponent,
    IceRodComponent,
    ShieldComponent,
    BoomerangComponent,
    HookshotComponent,
    MushroomComponent,
    PowderComponent,
    BootsComponent,
    GloveComponent,
    FlippersComponent,
    MoonPearlComponent,
    BombosComponent,
    EtherComponent,
    QuakeComponent,
    SomariaComponent,
    ByrnaComponent,
    CapeComponent,
    MirrorComponent,
    BottleComponent,
    HammerComponent,
    ShovelComponent,
    FluteComponent,
    NetComponent,
    BookComponent,
    TunicComponent,
    SilverArrowsComponent,
    LanternComponent,
    DungeonComponent,
    CamelCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
