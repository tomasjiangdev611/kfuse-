import { logsQueryOperator } from 'utils';

const buildSearchTermsFilter = (searchTerms: string[]): string => {
  let result = '';
  searchTerms.forEach((searchTerm: string) => {
    const sanitizedSearchTerm = searchTerm.replace(/"/g, '\\"');

    const [operator] = searchTerm.split(':');
    const search = searchTerm.replace(`${operator}:`, '');
    if (operator && search) {
      const operatorStr = logsQueryOperator[operator];
      const sanitizedSearch = search.replace(/"/g, '\\"');
      const sanitizedQuery = `{facetName: "msg", value: "${sanitizedSearch}"}`;
      if (operatorStr === 'eq') {
        result += `{contains: ${sanitizedQuery}}`;
        return;
      }
      if (operatorStr === 'neq') {
        result += `{not: {contains: ${sanitizedQuery}}}`;
        return;
      }
      if (operatorStr === 'regex') {
        result += `{regex: ${sanitizedQuery}}`;
        return;
      }
      if (operatorStr === 'notregex') {
        result += `{not: {regex: ${sanitizedQuery}}}`;
        return;
      }
      result += `{contains: {facetName: "msg", value: "${sanitizedSearchTerm}"}}`;
    } else {
      result += `{contains: {facetName: "msg", value: "${sanitizedSearchTerm}"}}`;
    }
  });

  return result;
};

export default buildSearchTermsFilter;
