const { translateClaimString } = require('./main');

describe('translateClaimString', () => {
  beforeEach(async () => {
    jest.setTimeout(10000);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  describe('one claim', () => {
    describe('claim only property', () => {
      it('one claim only property', async () => {
        const result = await translateClaimString('国籍');
        expect(result).toBe('P27');
      });
      it('one not claim only property', async () => {
        const result = await translateClaimString('~国籍');
        expect(result).toBe('~P27');
      });
    });
    describe('one claim property and qualifier', () => {
      it('simple claim property and qualifier', async () => {
        const result = await translateClaimString('国籍:日本');
        expect(result).toBe('P27:Q17');
      });
      it('one not claim property and qualifier', async () => {
        const result = await translateClaimString('~国籍:日本');
        expect(result).toBe('~P27:Q17');
      });
    });
  });
  describe('and', () => {
    it('claim contains and operator', async () => {
      const result = await translateClaimString('国籍:日本&職業:政治家');
      expect(result).toBe('P27:Q17&P106:Q82955');
    });
  });
  describe('or', () => {
    it('claim contains pipe or operator', async () => {
      const result = await translateClaimString('国籍:日本|国籍:アメリカ合衆国');
      expect(result).toBe('P27:Q17|P27:Q30');
    });
    it('claim contains comma or operator', async () => {
      const result = await translateClaimString('国籍:日本,アメリカ合衆国');
      expect(result).toBe('P27:Q17,Q30');
    });
  });
  describe('complex', () => {
    it('complex claim', async () => {
      const result = await translateClaimString('国籍:日本&職業:政治家&~所属政党:日本民主党&~死亡年月日');
      expect(result).toBe('P27:Q17&P106:Q82955&~P102:Q1424871&~P570');
    });
  });
});