import { buildFacetQuery } from './buildFacetQuery';

describe('buildFacetQuery', () => {
  it('should return an empty string if no facet names', () => {
    const result = buildFacetQuery([]);
    expect(result).toBe('');
  });

  it('should return a query for equal facet value', () => {
    const facetNames = ['cloud:cluster-name="demo"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(
      `{ eq: { facetName: "@cloud.cluster-name", value: "demo" } }`,
    );
  });

  it('should return a query for not equal facet value', () => {
    const facetNames = ['cloud:cluster-name!="observes"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(
      `{ neq: { facetName: "@cloud.cluster-name", value: "observes" } }`,
    );
  });

  it('should return a query for less than facet value', () => {
    const facetNames = ['kube:offset<"0.2"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(`{ lt: { facetName: "@kube.offset", value: "0.2" } }`);
  });

  it('should return a query for less than or equal to facet value', () => {
    const facetNames = ['kube:offset<="0.2"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(`{ lte: { facetName: "@kube.offset", value: "0.2" } }`);
  });

  it('should return a query for greater than facet value', () => {
    const facetNames = ['kube:offset>"0.2"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(`{ gt: { facetName: "@kube.offset", value: "0.2" } }`);
  });

  it('should return a query for greater than or equal to facet value', () => {
    const facetNames = ['kube:offset>="0.2"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(`{ gte: { facetName: "@kube.offset", value: "0.2" } }`);
  });

  it('should return a query for regex facet value', () => {
    const facetNames = ['cloud:cluster-name=~"^.*observes.*$"'];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(
      `{ regex: { facetName: "@cloud.cluster-name", value: "^.*observes.*$" } }`,
    );
  });

  it('should return a query for multiple facet values', () => {
    const facetNames = [
      'cloud:cluster-name="demo"',
      'cloud:cluster-name!="observes"',
      'cloud:cluster-name=~"^.*observes.*$"',
    ];
    const result = buildFacetQuery(facetNames);
    expect(result).toBe(
      `{ eq: { facetName: "@cloud.cluster-name", value: "demo" } }{ neq: { facetName: "@cloud.cluster-name", value: "observes" } }{ regex: { facetName: "@cloud.cluster-name", value: "^.*observes.*$" } }`,
    );
  });
});
