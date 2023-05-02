const fetchJSON = async <T>(url: string, options: any = {}): Promise<T> => {
  return fetch(url, {
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    ...options,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .catch((error: Error) => {
      throw error;
    });
};

export default fetchJSON;
