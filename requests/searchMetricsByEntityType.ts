import query from './query';

const searchMetrics = (entityType: string) =>
  query(`
  {
    searchMetrics(searchStr: "", entityType: ${entityType}) {
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
