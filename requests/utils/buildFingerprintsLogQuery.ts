import { FilterOrExcludeByFingerprint } from 'types';

const buildFingerprintsLogQuerySection = (fingerprints: string[], operator: string): string => {
  if (fingerprints.length == 0) {
    return '';
  }

  if (fingerprints.length === 1) {
    return `{ ${operator}: { facetName: "fp_hash", value: "${fingerprints[0]}" } }`;
  }

  let result = `{ ${operator === 'neq' ? 'and' : 'or'}: [`;
  fingerprints.forEach((fpHash) => {
    result += `{ ${operator}: { facetName: "fp_hash", value: "${fpHash}" } }`;
  });
  result += ']}';

  return result;
};

const buildFingerprintsLogQuery = (filterOrExcludeByFingerprint: FilterOrExcludeByFingerprint) => {
  let result = '';
  const eqFingerprints = Object.keys(filterOrExcludeByFingerprint).filter(
    (fpHash) => filterOrExcludeByFingerprint[fpHash],
  );

  result += buildFingerprintsLogQuerySection(eqFingerprints, 'eq');

  const neqFingerprints = Object.keys(filterOrExcludeByFingerprint).filter(
    (fpHash) => !filterOrExcludeByFingerprint[fpHash],
  );

  result += buildFingerprintsLogQuerySection(neqFingerprints, 'neq');

  return result;
};

export default buildFingerprintsLogQuery;
