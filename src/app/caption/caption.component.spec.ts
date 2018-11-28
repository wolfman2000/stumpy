import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CaptionService } from './caption.service';
import { CaptionComponent } from './caption.component';
import { TextToImage } from './text-to-image.pipe';
import { SaveService } from '../save.service';

describe( 'The caption component', () => {
  let comp: CaptionComponent;
  let fixture: ComponentFixture<CaptionComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let captionService: CaptionService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [CaptionComponent],
      providers: [CaptionService, TextToImage, SaveService]
    }).compileComponents();

    fixture = TestBed.createComponent( CaptionComponent );
    comp = fixture.componentInstance;

    de = fixture.debugElement;
    el = de.nativeElement;
    captionService = de.injector.get( CaptionService );
  });

  it( 'should be created successfully.', () => {
    expect( de.componentInstance ).toBeTruthy();
  });

  it( 'should start off getting a non breaking space due to the lack of a message.', () => {
    expect( comp.getMessage() ).toBe( '&nbsp;' );
  });

  it( 'should still get a non breaking space if an empty message is sent.', () => {
    captionService.message = '';
    fixture.detectChanges();
    expect( comp.getMessage() ).toBe( '&nbsp;' );
  });

  it( 'should return the message put in if not empty.', () => {
    const myMessage = 'Testing';
    captionService.message = myMessage;

    expect( comp.getMessage() ).toBe( myMessage );
  });
} );
