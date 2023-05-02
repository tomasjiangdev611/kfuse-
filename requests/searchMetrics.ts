import query from './query';

const searchMetrics = () =>
  query(`
  {
    searchMetrics(searchStr: "") {
      name
      entityType
      description
    }
  }
`).then(
    (data) =>
      data?.searchMetrics?.sort((a, b) => a.name.localeCompare(b.name)) || [],
  );

export default searchMetrics;
