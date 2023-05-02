import {
  getFacetNamesOptions,
  getFacetValuesOptions,
  isOptionsExist,
  parseOperatorAndValue,
} from './index';

describe('getFacetNamesOptions', () => {
  it('should return an array of options', () => {
    const facetNames = [
      { component: 'cloud', name: 'foo' },
      { component: 'cloud', name: 'bar' },
    ];
    const result = getFacetNamesOptions(facetNames, 'label');
    expect(result).toEqual([
      { label: 'cloud:foo', value: 'cloud:foo', optionType: 'label' },
      { label: 'cloud:bar', value: 'cloud:bar', optionType: 'label' },
    ]);
  });

  it('should return an empty array if no facet names', () => {
    const result = getFacetNamesOptions([], 'label');
    expect(result).toEqual([]);
  });
});

describe('getFacetValuesOptions', () => {
  it('should return an array of options', () => {
    const facetValues = [
      { facetValue: 'foo', count: 10 },
      { facetValue: 'bar', count: 10 },
    ];
    const result = getFacetValuesOptions(facetValues);
    expect(result).toEqual([
      { label: 'foo', value: 'foo', optionType: 'value' },
      { label: 'bar', value: 'bar', optionType: 'value' },
    ]);
  });

  it('should return an empty array if no facet values', () => {
    const result = getFacetValuesOptions([]);
    expect(result).toEqual([]);
  });
});

describe('isOptionsExist', () => {
  it('should return true if options exist', () => {
    const record = [{ value: 'foo' }, { value: 'bar' }];
    const searchValue = 'foo';
    const result = isOptionsExist(record, searchValue);
    expect(result).toBe(true);
  });

  it('should return false if options do not exist', () => {
    const record = [{ value: 'foo' }, { value: 'bar' }];
    const searchValue = 'baz';
    const result = isOptionsExist(record, searchValue);
    expect(result).toBe(false);
  });

  it('should return false if no options', () => {
    const record = [];
    const searchValue = 'baz';
    const result = isOptionsExist(record, searchValue);
    expect(result).toBe(false);
  });

  it('should return false if no search value', () => {
    const record = [{ value: 'foo' }, { value: 'bar' }];
    const searchValue = undefined;
    const result = isOptionsExist(record, searchValue);
    expect(result).toBe(false);
  });
});

jest.mock('constants', () => ({
  delimiter: ':!:',
}));

describe('parseOperatorAndValue', () => {
  it('should return an object with operator and value for equal', () => {
    const result = parseOperatorAndValue('foo="ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '=',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for not equal', () => {
    const result = parseOperatorAndValue('foo!="ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '!=',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for greater than', () => {
    const result = parseOperatorAndValue('foo>"ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '>',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for less than', () => {
    const result = parseOperatorAndValue('foo<"ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '<',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for greater than or equal', () => {
    const result = parseOperatorAndValue('foo>="ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '>=',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for less than or equal', () => {
    const result = parseOperatorAndValue('foo<="ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '<=',
      parsedValue: 'ba',
    });
  });

  it('should return an object with operator and value for regex', () => {
    const result = parseOperatorAndValue('foo~="ba"', 'foo');
    expect(result).toEqual({
      parsedOperator: '~=',
      parsedValue: 'ba',
    });
  });

  it('should return an object with empty operator and value', () => {
    const result = parseOperatorAndValue('foo=', 'foo');
    expect(result).toEqual({
      parsedOperator: '',
      parsedValue: '',
    });
  });

  it('should return an object with empty operator and value when search string is empty', () => {
    const result = parseOperatorAndValue('', 'foo');
    expect(result).toEqual({
      parsedOperator: '',
      parsedValue: '',
    });
  });
});
