export type SelectedItemsFilter = {
  facet: string;
  facetValue: string;
  type: 'eq' | 'neq';
};

export type DeleteRuleProps = {
  groupFile: string;
  folderName: string;
  uid: string;
  alertType: string;
  metricName: string;
};
