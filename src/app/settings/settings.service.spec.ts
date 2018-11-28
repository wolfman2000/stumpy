import { SettingsService } from './settings.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { SwordLogic } from './sword-logic';
import { GlitchLogic } from './glitch-logic';
import { SaveService } from '../save.service';

describe( 'The settings service', () => {
  let service: SettingsService;

  beforeAll(() => {
    service = new SettingsService( new SaveService(), new WordSpacingPipe() );
  });

  beforeEach(() => {
    service.swordLogic = SwordLogic.Randomized;
    service.logic = GlitchLogic.None;
  });

  it( 'should start with default settings.', () => {
    expect( service.swordLogic ).toBe( SwordLogic.Randomized );
    expect( service.logic ).toBe( GlitchLogic.None );
  });

  it( 'should save new settings, then load those settings between different instances of the service.', () => {
    service.swordLogic = SwordLogic.UncleAssured;
    service.logic = GlitchLogic.Overworld;

    const secondService = new SettingsService(new SaveService(), new WordSpacingPipe() );

    expect( secondService.swordLogic ).toBe( service.swordLogic );
    expect( secondService.logic ).toBe( service.logic );
  });

  it( 'should get the correct number of drop down choices sucessfully for each option.', () => {
    expect( service.startStateKeys.length ).toBe( 2 );
    expect( service.swordLogicKeys.length ).toBe( 3 );
    expect( service.logicKeys.length ).toBe( 3 );
    expect( service.showGoModeKeys.length ).toBe( 2 );
    expect( service.difficultyKeys.length ).toBe( 5 );
    expect( service.goalKeys.length ).toBe( 3 );
    expect( service.itemShuffleKeys.length ).toBe( 3 );
  });
});
