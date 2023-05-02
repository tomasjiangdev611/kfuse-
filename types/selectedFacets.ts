export type SelectedFacetRangeByName = {
  [name: string]: SelectedFacetRange;
};

export type SelectedFacetRange = { lower: number; upper: number };

export type SelectedFacetValues = {
  [value: string]: number;
};

export type SelectedFacetValuesByName = {
  [name: string]: SelectedFacetValues;
};

export type SelectedFacetValuesByNameByGroup = {
  [group: string]: SelectedFacetValuesByName;
};

export type FacetValueAndCount = {
  count: number;
  value: string;
};
