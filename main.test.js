const { translateClaimString } = require('./main');

describe('translateClaimString', () => {
  beforeEach(async () => {
    jest.setTimeout(10000);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  it('simple claim only property', async () => {
    const result = await translateClaimString('国籍')
    expect(result).toBe('P27')
  });
  it('simple claim property and qualifier', async () => {
    const result = await translateClaimString('国籍:日本')
    expect(result).toBe('P27:Q17')
  });
  it('simple not claim only property', async () => {
    const result = await translateClaimString('~国籍')
    expect(result).toBe('~P27')
  });
  it('simple not claim property and qualifier', async () => {
    const result = await translateClaimString('~国籍:日本')
    expect(result).toBe('~P27:Q17')
  });
  it('claim contains and operator', async () => {
    const result = await translateClaimString('国籍:日本&職業:政治家')
    expect(result).toBe('P27:Q17&P106:Q82955')
  });
  it('claim contains or operator', async () => {
    const result = await translateClaimString('国籍:日本|国籍:アメリカ合衆国')
    expect(result).toBe('P27:Q17|P27:Q30')
  });
});