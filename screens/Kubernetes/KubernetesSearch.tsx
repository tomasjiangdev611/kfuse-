import React from 'react';
import KubesSearchBar from './KubesSearchBar';
import { useKubesState } from './hooks';

type Props = {
  kubesState: ReturnType<typeof useKubesState>;
};

const KubernetesSearch = ({ kubesState }: Props) => {
  return (
    <div className="kubernetes__search" style={{ width: '100%' }}>
      <div className="kubernetes__search__input">
        <div className="kubernetes__search__input__left">Filter By</div>
        <KubesSearchBar kubesState={kubesState} />
      </div>
    </div>
  );
};

export default KubernetesSearch;
