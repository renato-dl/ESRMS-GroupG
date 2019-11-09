import axios from 'axios';
import {UNAUTHORIZED} from 'http-status-codes';

export class BaseAPIService {
  constructor() {
    const options = { baseURL: '/api' };
    this.instance = axios(options);
    this.attachInterceptors();
  }

  attachInterceptors() {
    this.addRequestInterceptors();
    this.addResponseInterceptors();
  }

  addRequestInterceptors() {
    this.instance.interceptors.request.use((data) => {
      // TODO: not useful for now, useful when we will require auth
      const token = 'test_token';
      data.headers.Authorization = 'Bearer ' + token;
      return data;
    })
  }

  addResponseInterceptors() {
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === UNAUTHORIZED) {
          console.log('Unauthorized user....');
          // maybe show some alert to the user
        }

        return Promise.reject(error);
      });
  }

  get(url, params = {}) {
    return this.instance.get(url, { params });
  }

  post(url, data, params = {}) {
    return this.instance.post(url, data, { params });
  }

  delete(url, data, params = {}) {
    return this.instance.delete(url, { params, data });
  }

  put(url, data, params = {}) {
    return this.instance.put(url, data, params);
  }

  patch(url, data, params = {}) {
    return this.instance.patch(url, data, { params });
  }
}