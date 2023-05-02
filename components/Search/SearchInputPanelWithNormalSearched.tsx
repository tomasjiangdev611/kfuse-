import classnames from 'classnames';
import React from 'react';

const SearchInputPanelWithNormalSearched = ({
  activeIndex,
  labelValue,
  onClickLabelValueHandler,
  searchedLabelValues,
  setActiveIndex,
}) => {
  return searchedLabelValues.map((labelValue, i) => (
    <div
      className={classnames({
        search__input__panel__item: true,
        'search__input__panel__item--active': i === activeIndex,
      })}
      key={labelValue}
      onClick={onClickLabelValueHandler(labelValue)}
      onMouseEnter={() => setActiveIndex(i)}
    >
      {labelValue}
    </div>
  ));
};

export default SearchInputPanelWithNormalSearched;
