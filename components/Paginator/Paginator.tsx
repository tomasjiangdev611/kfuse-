import classnames from 'classnames';
import React from 'react';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { PanelPosition } from 'types';
import usePaginator from './usePaginator;';
import { Select } from '../SelectV2';

const resultsPerPageLimits = [10, 25, 50];
const getOptions = (numberOfRowsPerPage: number, rowsCount: number) => [
  { label: 'All', value: null },
  ...resultsPerPageLimits
    .filter((limit) => rowsCount > limit || limit === numberOfRowsPerPage)
    .map((limit) => ({
      label: limit,
      value: limit,
    })),
];

const getSlicePageIndexes = ({ activePageIndex, maxNumberOfPages }) => {
  const result = [];
  const sliceStart = Math.max(activePageIndex - 2, 0);
  const sliceEnd = Math.min(sliceStart + 4, maxNumberOfPages - 1);

  for (let i = sliceStart; i <= sliceEnd; i += 1) {
    result.push(i);
  }

  const length = result.length;
  for (let i = 0; i < 5 - length; i += 1) {
    const index = result[0] - 1;
    if (index > -1) {
      result.unshift(index);
    }
  }

  return result;
};

type Props = {
  paginator: ReturnType<typeof usePaginator>;
};

const Paginator = ({ paginator }: Props) => {
  const {
    activePageIndex,
    showNextPage,
    showPrevPage,
    maxNumberOfPages,
    numberOfRowsPerPage,
    rowsCount,
    setActivePageIndex,
    setNumberOfRowsPerPage,
  } = paginator;
  const slicePageIndexes = getSlicePageIndexes({
    activePageIndex,
    maxNumberOfPages,
  });

  const onClickHandler = (index: number) => () => {
    setActivePageIndex(index);
  };

  if (rowsCount <= resultsPerPageLimits[0]) {
    return null;
  }

  return (
    <div className="paginator">
      <div className="paginator__label">Results per page:</div>
      <Select
        className="paginator__select"
        onChange={setNumberOfRowsPerPage}
        options={getOptions(numberOfRowsPerPage, rowsCount)}
        top
        value={numberOfRowsPerPage}
      />
      {numberOfRowsPerPage !== null ? (
        <div className="paginator__buttons">
          <button
            className={classnames({
              paginator__buttons__arrow: true,
              'paginator__buttons__arrow--disabled': activePageIndex === 0,
            })}
            onClick={showPrevPage}
          >
            <BsArrowLeftShort />
          </button>
          {slicePageIndexes.map((index) => (
            <button
              className={classnames({
                paginator__buttons__number: true,
                'paginator__buttons__number--active': index === activePageIndex,
              })}
              key={index}
              onClick={onClickHandler(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={classnames({
              paginator__buttons__arrow: true,
              'paginator__buttons__arrow--disabled':
                activePageIndex === maxNumberOfPages - 1,
            })}
            onClick={showNextPage}
          >
            <BsArrowRightShort />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Paginator;
