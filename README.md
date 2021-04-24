# wikibase-query-translate

## What is this
- `国籍:日本&職業:政治家&~所属政党:日本民主党&~死亡年月日` のような文字列を
- `P27:Q17&P106:Q82955&~P102:Q1424871&~P570` に変換します

## Usage
```
node main.js '国籍:日本&職業:政治家&~所属政党:日本民主党&~死亡年月日'
```

## Development

### Setup
```
npm ci
```

### Test
```
npm test
```

or

```
npx jest
```