import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { NgModule, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { MapModule } from './map/map.module';

import { AppComponent } from './app.component';
import { RandomizerSettingsComponent } from './settings/settings.component';
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

describe( 'The application component', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach( async(() => {
    TestBed.configureTestingModule( {
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
        DungeonComponent
      ],
      imports: [
        FormsModule,
        AppRoutingModule,
        MapModule.forRoot()
      ],
      providers: [ {
        provide: APP_BASE_HREF,
        useValue: '/'
      }, {
        provide: ComponentFixtureAutoDetect,
        useValue: true
      } ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( AppComponent );

    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should have the title be set correctly.', () => {
    expect( de.componentInstance.title ).toEqual('Stumpy, a Link to the Past Item Tracker');
  });

  it( 'should have the title in a h2 tag.', () => {
    expect( el.querySelector('h2').textContent).toContain('Welcome to Stumpy, a Link to the Past Item Tracker!');
  });
});
