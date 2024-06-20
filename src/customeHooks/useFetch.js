import axios from 'axios';
import { useState } from 'react';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, method = 'GET', body = {}, headers = {},other= {}) => {
    setLoading(true);
    setError(null);

    try {
      let response; 
      let sendData = body? body: {};
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity,
        withCredentials: true 
      }

      if (method === 'GET') {
        response = await axios.get(`${import.meta.env.VITE_APP_API}${url}`, sendData, config);
      } else if (method === 'POST') {
        response = await axios.post(`${import.meta.env.VITE_APP_API}${url}`, sendData, config);
      } else if (method === 'PUT') {
        response = await axios.put(`${import.meta.env.VITE_APP_API}${url}`, sendData, config);
      } else if (method === 'DELETE') {
        response = await axios.delete(`${import.meta.env.VITE_APP_API}${url}`, { ...config, data: sendData });
      }

      setData(response.data);
      return response;

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
