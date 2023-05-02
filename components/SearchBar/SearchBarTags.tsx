import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { SearchBarTagsProps } from 'types/SearchBar';

const SearchBarTags = ({
  isSourceExist,
  markForDeletionToggle,
  tags,
}: {
  isSourceExist: boolean;
  markForDeletionToggle: any;
  tags: SearchBarTagsProps[];
}): ReactElement => {
  return (
    <>
      {tags &&
        tags.map((tag, i) => {
          const onRemove = (e) => {
            e.stopPropagation();
            tag.onClick();
          };

          const onEdit = (e) => {
            e.stopPropagation();
            tag.onEdit();
          };
          return (
            <div
              key={i}
              className={classNames({
                chip: true,
                'chip--marked-for-deletion':
                  markForDeletionToggle.value && i === tags.length - 1,
                'chip--disabled-red':
                  !isSourceExist && tag.label.startsWith('search:'),
              })}
              title={tag.label}
            >
              {tag.onEdit ? (
                <button
                  className="chip__label chip__label--clickable"
                  onClick={onEdit}
                >
                  {tag.label}
                </button>
              ) : (
                <span className="chip__label">{tag.label}</span>
              )}
              <button className="chip__button" onClick={onRemove} type="button">
                <X size={12} />
              </button>
            </div>
          );
        })}
    </>
  );
};

export default SearchBarTags;
