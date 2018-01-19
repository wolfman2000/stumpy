import { SettingsService } from './settings.service';
import { LocalStorageService } from '../local-storage.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';

describe( 'The settings service', () => {
  let service: SettingsService;

  beforeAll(() => {
    service = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
  });

  beforeEach(() => {
    service.mode = Mode.Standard;

    const store: any = {};

    spyOn( localStorage, 'getItem' ).and.callFake( (key: string): string => {
      return store[key] || null;
    });

    spyOn( localStorage, 'removeItem' ).and.callFake( (key: string): void => {
      delete store[key];
    });

    spyOn( localStorage, 'setItem' ).and.callFake( (key: string, value: string): void => {
      store[key] = value;
    });
  });

  it( 'should start with default settings.', () => {
    expect( service.mode ).toBe( Mode.Standard );
    expect( service.logic ).toBe( GlitchLogic.None );
  });

  it( 'should save new settings, then load those settings between different instances of the service.', () => {
    service.mode = Mode.Open;
    service.logic = GlitchLogic.Overworld;

    const secondService = new SettingsService(new LocalStorageService(), new WordSpacingPipe() );

    expect( secondService.mode ).toBe( service.mode );
    expect( secondService.logic ).toBe( service.logic );
  });

  it( 'should get the correct number of drop down choices sucessfully for each option.', () => {
    expect( service.modeKeys.length ).toBe( 3 );
    expect( service.logicKeys.length ).toBe( 3 );
    expect( service.showGoModeKeys.length ).toBe( 2 );
    expect( service.difficultyKeys.length ).toBe( 5 );
    expect( service.goalKeys.length ).toBe( 3 );
    expect( service.itemShuffleKeys.length ).toBe( 2 );
  });
});
