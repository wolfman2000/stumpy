import { TextToImage } from './text-to-image.pipe';

describe( 'The text to image pipe', () => {
  let tti: TextToImage;

  beforeEach( () => {
    tti = new TextToImage();
  });

  it( 'Takes an empty string and returns back said empty string.', () => {
    expect( tti.transform('')).toBe('');
  });

  it( 'Takes a formatted string and puts in an HTML tag instead.', () => {
    const start = 'Needs {boots}';

    const end = tti.transform( start );
    expect( end ).toContain( '<img' );
    expect( end ).toContain( 'boots.png' );
  });

  it( 'Takes a formatted string with a number and changes the image name within.', () => {
    const start = 'Needs {sword2}';

    const end = tti.transform( start );

    expect( end ).toContain( 'sword2.png' );
  });
});
