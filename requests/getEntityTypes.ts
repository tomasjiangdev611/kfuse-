import { EntityType } from 'types';
import query from './query';

type EntityTypeObject = {
  name: EntityType;
};

type EnumTypeResponse = {
  enumValues: EntityTypeObject[];
};

const getEntityTypes = (): Promise<string[]> =>
  query<EnumTypeResponse, '__type'>(`
    {
      __type(name: "EntityType") {
        enumValues {
          name
        }
      }
    }
  `)
    .then((data) => data?.__type?.enumValues || [])
    .then((entityTypeObjects) =>
      entityTypeObjects
        .map((entityTypeObject: EntityTypeObject) => entityTypeObject.name)
        .sort((a: string, b: string) => a.localeCompare(b)),
    );

export default getEntityTypes;
