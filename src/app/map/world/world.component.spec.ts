import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { WorldComponent } from './world.component';
import { ItemLocationComponent } from '../item-locations/item-location.component';
import { DungeonLocationComponent } from '../dungeon-locations/dungeon-location.component';

import { CamelCasePipe } from '../../camel-case.pipe';
import { WordSpacingPipe } from '../../word-spacing.pipe';

import { CaptionService } from '../../caption/caption.service';
import { LocalStorageService } from '../../local-storage.service';
import { SettingsService } from '../../settings/settings.service';
import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { ItemLocationService } from '../item-locations/item-location.service';
import { DungeonLocationService } from '../dungeon-locations/dungeon-location.service';
import { BossService } from '../../boss/boss.service';
import { SaveService } from '../../save.service';

describe( 'The world component', () => {
  let comp: WorldComponent;
  let fixture: ComponentFixture<WorldComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [WorldComponent, ItemLocationComponent, DungeonLocationComponent],
      providers: [
        CamelCasePipe,
        WordSpacingPipe,
        CaptionService,
        LocalStorageService,
        SettingsService,
        ItemService,
        DungeonService,
        ItemLocationService,
        DungeonLocationService,
        BossService,
        SaveService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent( WorldComponent );
    comp = fixture.componentInstance;
    comp.worldId = 0;
    fixture.detectChanges();

    de = fixture.debugElement;
    el = de.nativeElement;
  }));

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });
});

