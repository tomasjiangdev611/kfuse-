/**
 * Transform into GRAPHQL query to JSON
 * @param param0
 * @returns json
 * @example "{and: [{ eq: { facetName: "source", value: "catalogue" } }{ eq: { facetName: "source", value: "agent" } }]}"
 *  => {"and":[{"eq":{"facetName":"source","value":"catalogue"}},{"eq":{"facetName":"source","value":"agent"}}]}
 * "{and: [{ eq: { facetName: "source", value: "user" } }{ keyExists: "@user:string.took" }]}"
 *  => {"and": [{ "eq": { "facetName": "source", "value": "user" } },{ "keyExists": "@user:string.took" }]}
 */
const transformGRAPQLQueryToJSON = (query: string): any => {
  const queryDoubleQuoted = query
    .replace(/(\w+): /g, '"$1": ')
    .replace(/'/g, '"');
  const queryBracketed = queryDoubleQuoted.split('}{').join('},{');
  console.log(query, queryBracketed);
  return JSON.parse(queryBracketed);
};

export default transformGRAPQLQueryToJSON;
