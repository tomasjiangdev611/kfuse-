import { Select } from 'components';
import { useForm, useRequest } from 'hooks';
import React, { useEffect } from 'react';

type Props = {
  facetName: string;
  filtersForm: ReturnType<typeof useForm>;
  label: string;
  request: () => Promise<string[]>;
};

const ServiceFiltersItem = ({
  facetName,
  filtersForm,
  label,
  request,
}: Props) => {
  const { propsByKey } = filtersForm;
  const optionsRequest = useRequest(request);

  useEffect(() => {
    optionsRequest.call();
  }, []);

  const options = optionsRequest.result || [];

  return (
    <div className="service__filters__item">
      <Select
        className="select--thin"
        options={[
          { label: `${label}: All`, value: null },
          ...options.map((option) => ({
            label: `${label}: ${option}`,
            value: option,
          })),
        ]}
        {...propsByKey(facetName)}
      />
    </div>
  );
};

export default ServiceFiltersItem;
