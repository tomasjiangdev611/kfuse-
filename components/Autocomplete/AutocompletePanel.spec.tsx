import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AutocompletePanel from './AutocompletePanel';

describe('AutocompletePanel', () => {
  it('renders and test keyboard navigation', () => {
    const options = [
      { value: 'foo', label: 'Foo' },
      { value: 'bar', label: 'Bar' },
      { value: 'baz', label: 'Baz' },
      { value: 'qux', label: 'Qux' },
    ];

    const mockOnClickHandler = jest.fn(() => jest.fn());
    const { getByText, getByTestId, rerender, queryByText } = render(
      <AutocompletePanel
        options={options}
        onClickHandler={mockOnClickHandler}
        typed=""
        value={''}
        close={jest.fn()}
      />,
    );

    expect(getByText('Foo')).toBeInTheDocument();
    expect(getByText('Bar')).toBeInTheDocument();

    fireEvent.mouseDown(getByText('Bar'));

    expect(mockOnClickHandler).toHaveBeenCalledWith(
      expect.any(Function),
      'foo',
    );

    const autoCompleteTestId = getByTestId('autocomplete-panel');
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });
    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowDown' });

    const selectedRow = getByText('Qux').parentElement;
    expect(selectedRow).toHaveClass('autocomplete__panel__option--active');

    fireEvent.keyDown(autoCompleteTestId, { key: 'ArrowUp' });
    expect(selectedRow).not.toHaveClass('autocomplete__panel__option--active');

    fireEvent.keyDown(autoCompleteTestId, { key: 'Enter' });

    rerender(
      <AutocompletePanel
        options={options}
        onClickHandler={mockOnClickHandler}
        typed="f"
        value={''}
        close={jest.fn()}
      />,
    );

    expect(queryByText('Qux')).not.toBeInTheDocument();
    expect(getByText('Foo')).not.toHaveClass(
      'autocomplete__panel__option--active',
    );
  });
});
