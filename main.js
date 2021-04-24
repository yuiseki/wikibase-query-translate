const fetch = require('node-fetch');
const { program } = require('commander');
program.version('0.0.1');

const WBK = require('wikibase-sdk');
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

const getProperty = async (word) => {
  const url = wdk.searchEntities({
    search: word,
    language: 'ja',
    limit: 1,
    type: 'property'
  });
  const res = await fetch(url);
  const json = await res.json();
  const result = json.search.filter((i) => { return i.label === word; });
  return result[0].id;
};

const getRedirectedSitelinkTitle = async (word) => {
  const lang = 'ja';
  const site = 'wikipedia';
  const title = encodeURIComponent(word);
  const url = `https://${lang}.${site}.org/w/api.php?format=json&action=query&redirects&titles=${title}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.query.pages[Object.keys(json.query.pages)[0]].title;
};

const getQualifier = async (word) => {
  const title = await getRedirectedSitelinkTitle(word);
  const url = wdk.getEntitiesFromSitelinks({
    titles: title,
    limit: 10,
    sites: 'jawiki',
    uselang: 'ja'
  });
  const res = await fetch(url);
  const json = await res.json();
  return Object.keys(json.entities)[0];
};

const getQualifiers = async (words) => {
  let qualifiers = [];
  for (const word of words) {
    qualifiers.push(await getQualifier(word));
  }
  return qualifiers.join(',');
};

const translateClaim = async (claim) => {
  const not_claim = (claim.indexOf('~') === 0);
  if (claim.indexOf(':') > 0) {
    let property = claim.split(':')[0];
    if (not_claim) {
      property = property.replace('~', '');
    }
    const p = await getProperty(property);
    const qualifier = claim.split(':')[1];
    let q;
    if (qualifier.indexOf(',') > 0) {
      q = await getQualifiers(qualifier.split(','));
    } else {
      q = await getQualifier(qualifier);
    }
    let query = `${p}:${q}`;
    if (not_claim) {
      query = `~${query}`;
    }
    return query;
  } else {
    let property = claim;
    if (not_claim) {
      property = property.replace('~', '');
    }
    const p = await getProperty(property);
    let query = p;
    if (not_claim) {
      query = `~${query}`;
    }
    return query;
  }
};

const translateClaimString = async (claimString) => {
  let translatedQuery = '';
  for (const claim_or_op of claimString.split(/(&|\|)/)) {
    if (claim_or_op === '&' || claim_or_op === '|') {
      translatedQuery += claim_or_op;
    } else {
      translatedQuery += await translateClaim(claim_or_op);
    }
  }
  return translatedQuery;
};
exports.translateClaimString = translateClaimString;

if (require.main === module) {
  program.parse(process.argv);
  const originalQuery = program.args[0];
  (async () => {
    const translatedQuery = await translateClaimString(originalQuery);
    console.log(translatedQuery);
  })();
}
