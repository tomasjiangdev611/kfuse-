import { delimiter } from 'constants';
import { Dispatch, SetStateAction } from 'react';
import { getSelectedFacetValuesByFacetKey } from 'utils';

import { FacetBase, SearchBarTagsProps } from 'types';

export const getSearchTags = (
  removeSearchTermByIndex: (index: number) => void,
  searchTerms: string[],
  setSearch: Dispatch<SetStateAction<string>>,
): Array<SearchBarTagsProps> => {
  return searchTerms.map((searchTerm: string, i: number) => ({
    label: `search:${searchTerm}`,
    onClick: () => {
      removeSearchTermByIndex(i);
    },
    onEdit: () => {
      removeSearchTermByIndex(i);
      setSearch(searchTerm);
    },
  }));
};

export const getFingerprintTags = (
  filterOrExcludeByFingerprint: { [key: string]: boolean },
  clearFilterOrExcludeByFingerprint: (val: string) => void,
): Array<SearchBarTagsProps> => {
  return Object.keys(filterOrExcludeByFingerprint).map((fpHash) => ({
    label: `${
      filterOrExcludeByFingerprint[fpHash] ? '' : '-'
    }fingerprint:${fpHash}`,
    onClick: () => {
      clearFilterOrExcludeByFingerprint(fpHash);
    },
  }));
};

export const getKeyExistsTags = (
  keyExists: { [key: string]: boolean },
  toggleKeyExists: (val: FacetBase) => void,
): Array<SearchBarTagsProps> => {
  return Object.keys(keyExists)
    .filter((facetKeyWithType) => keyExists[facetKeyWithType])
    .map((facetKeyWithType) => {
      const [component, name, type] = facetKeyWithType.split(delimiter);
      return {
        label: `key exists: ${component}:${name}`,
        onClick: () => {
          toggleKeyExists({ component, name, type });
        },
      };
    });
};

export const getSelectedFacetValueTags = (
  selectedFacetValues: { [key: string]: number },
  editFacet: any,
  resetFacet: (val: FacetBase) => void,
  setEditFacet: Dispatch<SetStateAction<any>>,
): Array<SearchBarTagsProps> => {
  const selectedFacetValuesByFacetKey =
    getSelectedFacetValuesByFacetKey(selectedFacetValues);
  return Object.keys(selectedFacetValuesByFacetKey).map((facetKey) => {
    const [component, name] = facetKey.split(delimiter);
    const facetValuesBitMap = selectedFacetValuesByFacetKey[facetKey];
    const facetValues = Object.keys(facetValuesBitMap);
    const showAsMinus = facetValuesBitMap[facetValues[0]] === 0;

    const label = `${showAsMinus ? '-' : ''}${component}:${name}:${
      facetValues.length === 1 ? facetValues[0] : facetValues.length
    }`;

    return {
      label,
      onClick: () => {
        if (
          editFacet?.component === component &&
          editFacet?.facetName === name
        ) {
          setEditFacet(null);
        }

        resetFacet({ component, name });
      },
      onEdit: () => {
        setEditFacet({
          component,
          facetName: name,
          facetValuesBitMap,
        });
      },
    };
  });
};

export const getFilterByFacetTags = (
  facetQueries: string[],
  removeFilterByFacetByIndex: (val: number) => void,
  onEditFilterByFacet: (val: string) => void,
): Array<SearchBarTagsProps> => {
  return facetQueries.map((facetQuery, index) => ({
    label: `${facetQuery}`,
    onClick: () => {
      removeFilterByFacetByIndex(index);
    },
    onEdit: () => {
      onEditFilterByFacet(facetQuery);
      removeFilterByFacetByIndex(index);
    },
  }));
};
