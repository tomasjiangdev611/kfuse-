import fetchJson from './fetchJson';

const getAuthConfig = () => fetchJson('/auth/config');

export default getAuthConfig;
