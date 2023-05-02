import query from './query';

type Args = {
  fpHash: string;
  internalFacet: string;
  renamedFacet: string;
  source: string;
};

const saveRenamedFacet = async ({
  fpHash,
  internalFacet,
  renamedFacet,
  source,
}: Args): Promise<Record<'saveRenamedFacet', void>> => {
  return query<void, 'saveRenamedFacet'>(`
    mutation {
      saveRenamedFacet (
        fpHash: "${fpHash}"
        source: "${source}"
        internalFacet: "${internalFacet}"
        renamedFacet: "${renamedFacet}"
      )
    }

  `);
};

export default saveRenamedFacet;
