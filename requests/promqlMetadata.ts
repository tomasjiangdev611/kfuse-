import { onPromiseError } from 'utils';
import fetchJson from './fetchJson';

const promqlMetadata = (metric?: string): Promise<any> =>
  fetchJson(`/api/v1/metadata${metric ? `?metric=${metric}` : ''}`).then(
    (result) => result.data,
    onPromiseError,
  );

export default promqlMetadata;
