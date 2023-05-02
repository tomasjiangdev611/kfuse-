export type SelectedFacetValues = {
  [value: string]: number;
};

export type SelectedFacetValuesByName = {
  [name: string]: SelectedFacetValues;
};

export type SelectedFacetValuesByNameByGroup = {
  [group: string]: SelectedFacetValuesByName;
};


export type FacetValue = {
  count: number;
  value: string;
};
