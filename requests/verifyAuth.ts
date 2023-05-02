import fetchJson from './fetchJson';

const verifyAuth = () => fetchJson('/auth/verify');

export default verifyAuth;
