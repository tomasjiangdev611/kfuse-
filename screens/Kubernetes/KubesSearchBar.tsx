import { Input } from 'components';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { CgSearch } from 'react-icons/cg';
import { useKubesAutoCompleteState, useKubesState } from './hooks';

const KubesSearchBar = ({
  kubesState,
}: {
  kubesState: ReturnType<typeof useKubesState>;
}): ReactElement => {
  const {
    focusToggle,
    inputRef,
    onChange,
    onBackspace,
    onFoucs,
    onEnter,
    search,
    tags,
  } = useKubesAutoCompleteState(kubesState);

  return (
    <div className="events__header__search-bar" onClick={onFoucs}>
      <div className="events__header__search-bar__container">
        {tags.map((tag, i) => {
          const onRemove = (e) => {
            e.stopPropagation();
            tag.onRemove();
          };
          return (
            <div key={i} className="chip" title={tag.label}>
              <span className="chip__label">{tag.label}</span>
              <button className="chip__button" onClick={onRemove} type="button">
                <X size={12} />
              </button>
            </div>
          );
        })}
        <div className="kube__search__bar__title">
          <div className="kube__search__bar__title__icon">
            <CgSearch size={18} color="grey" />
          </div>
          <Input
            className="events__header__search-bar__container__input"
            onBackspace={onBackspace}
            onBlur={focusToggle.off}
            onChange={onChange}
            onEnter={onEnter}
            onFocus={onFoucs}
            ref={inputRef}
            placeholder="Filter by tag, label or annotation"
            type="text"
            value={search}
          />
        </div>
      </div>
    </div>
  );
};

export default KubesSearchBar;
