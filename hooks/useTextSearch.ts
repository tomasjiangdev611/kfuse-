import { useEffect, useMemo, useState } from 'react';
import { Index } from 'flexsearch';

type Args = {
  convertItem: (item: any) => [id: string, text: string];
  items: any[];
  search: string;
};

const useTextSearch = ({ convertItem, items, search }: Args) => {
  const [index, setIndex] = useState(new Index());

  useEffect(() => {
    const nextIndex = new Index();
    items.forEach((item) => {
      nextIndex.add(...convertItem(item));
    });

    setIndex(nextIndex);
  }, [items]);

  const results = useMemo(() => {
    const idsBitmap: { [key: string]: number } = index
      .search(search)
      .reduce((obj, id) => {
        return {
          ...obj,
          [id]: 1,
        };
      }, {});

    return items.filter((item) => idsBitmap[convertItem(item)[0]]);
  }, [search]);

  return results;
};

export default useTextSearch;
