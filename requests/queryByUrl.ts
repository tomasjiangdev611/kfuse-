import { Maybe } from 'types';
import fetchJson from './fetchJson';

type Response = {
  errors?: any[];
  data?: any;
};

const queryByUrl = (url: string) => <T, Key extends string | number | symbol>(
  query: string,
): Promise<Record<Key, Maybe<T>>> =>
  fetchJson(url, {
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

export default queryByUrl;
