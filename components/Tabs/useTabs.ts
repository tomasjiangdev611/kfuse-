import { useState } from 'react';

const useTabs = (initialActiveIndex?: number) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex || 0);

  return {
    activeIndex,
    setActiveIndex,
  };
};

export default useTabs;
