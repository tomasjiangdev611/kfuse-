import fetchJson from './fetchJson';

const login = (body) =>
  fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export default login;
