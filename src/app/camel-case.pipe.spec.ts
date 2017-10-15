import { CamelCasePipe } from './camel-case.pipe';

describe('CamelCasePipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCasePipe();
    expect(pipe).toBeTruthy();
  });
});
