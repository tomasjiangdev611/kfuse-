import { Maybe } from 'types';
import fetchJson from './fetchJson';

type Response = {
  errors?: any[];
  data?: any;
};

const query = <T, Key extends string | number | symbol>(
  query: string,
): Promise<Record<Key, Maybe<T>>> =>
  fetchJson('/query', {
    method: 'POST',
    body: JSON.stringify({
      operationName: null,
      query,
      variables: {},
    }),
  }).then((result: Response) => {
    const { errors, data } = result;
    if (errors) {
      return Promise.reject(errors);
    }

    return Promise.resolve(data);
  });

export default query;
