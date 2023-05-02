import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AutocompleteList from './AutocompleteList';

describe('AutocompleteList', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });
  it('renders and test keyboard navigation', () => {
    const options = [
      { value: 'foo', label: 'Foo', optionType: 'label' },
      { value: 'bar', label: 'Bar', optionType: 'label' },
      { value: 'baz', label: 'Baz', optionType: 'facet' },
      { value: 'qux', label: 'Qux', optionType: 'value' },
    ];

    const mockOnClickHandler = jest.fn();
    const mockClose = jest.fn();
    const { getByText, getByTestId, rerender, queryByText } = render(
      <AutocompleteList
        options={options}
        searchOption={{
          value: 'search',
          label: 'Search',
          optionType: 'search',
        }}
        optionType="label"
        onClickHandler={mockOnClickHandler}
        typed=""
        value={''}
        close={mockClose}
      />,
    );

    expect(getByText('Foo')).toBeInTheDocument();
    expect(getByText('Bar')).toBeInTheDocument();

    fireEvent.mouseDown(getByText('Bar'));

    expect(mockOnClickHandler).toHaveBeenCalledWith(
      expect.any(Function),
      { label: 'Bar', optionType: 'label', value: 'bar' },
      'mouse',
    );

    const autoCompleteTestId = getByTestId('autocomplete-list');
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });

    const selectedRow = getByText('Baz').parentElement;
    expect(selectedRow).toHaveClass('autocomplete__list__option--active');

    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowUp' });
    expect(selectedRow).not.toHaveClass('autocomplete__list__option--active');

    fireEvent.keyDown(autoCompleteTestId, { key: 'Enter' });

    rerender(
      <AutocompleteList
        options={options}
        searchOption={{
          value: 'search',
          label: 'Search',
          optionType: 'search',
        }}
        optionType="facet"
        onClickHandler={mockOnClickHandler}
        typed="f"
        value={''}
        close={mockClose}
      />,
    );

    expect(queryByText('Qux')).not.toBeInTheDocument();
    expect(getByText('Foo')).not.toHaveClass(
      'autocomplete__list__option--active',
    );
  });
});
