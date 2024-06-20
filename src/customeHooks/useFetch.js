
import { useState } from 'react';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, method = 'GET', body = null, headers = {},other= {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        ...other
      });

      const result = await response.json();
      setData(result);
      return {response,result};
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (url, headers = {},other = {}) => request(url, 'GET', null, headers, other);
  const post = (url, body, headers = {},other = {}) => request(url, 'POST', body, headers, other);
  const put = (url, body, headers = {},other = {}) => request(url, 'PUT', body, headers, other);
  const del = (url, headers = {},other = {}) => request(url, 'DELETE', null, headers, other);

  return { data, loading, error, get, post, put, del };
};

export default useApi;
