import React, { ReactElement, useState } from 'react';
import { getEntitiyDropdowndata } from './utils';
import { entityKeyMapping } from './utils/entityKeyMapping';

const KubernetesViewRelatedDropdown = ({
  entityType,
  activeKube,
  setViewRelatedEntity,
}: {
  entityType: string;
  activeKube: any;
  setViewRelatedEntity: (row: any) => void;
}): ReactElement => {
  const [selectedValue, setSelectedValue] = useState('Containers');
  let options = getEntitiyDropdowndata(entityType);

  if (entityType == 'Pod') {
    options = options.filter((option) => {
      const key = entityKeyMapping[option.value];
      return (
        !key || activeKube.pod.tags.some((tag) => tag.startsWith(`${key}:`))
      );
    });
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setViewRelatedEntity(event.target.value);
  };

  return (
    <div className="view__related__dropdown">
      <select value={selectedValue} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default KubernetesViewRelatedDropdown;
