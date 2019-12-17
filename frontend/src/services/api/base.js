import axios from 'axios';
import {UNAUTHORIZED} from 'http-status-codes';
import { config } from '../../config';

export class BaseAPIService {
  constructor() {
    const options = { baseURL: config.apiBaseUrl };
    this.instance = axios.create(options);
    this.attachInterceptors();
  }

  attachInterceptors() {
    this.addRequestInterceptors();
    this.addResponseInterceptors();
  }

  addRequestInterceptors() {
    this.instance.interceptors.request.use((data) => {
      let token = '';

      try {
        token = JSON.parse(localStorage.getItem("token"));
      } catch(e) {
        console.log(e);
      }

      if (token) {
        data.headers.Authorization = 'Bearer ' + token;
      }

      return data;
    })
  }

  addResponseInterceptors() {
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (!error.response) {
          return Promise.reject(error);
        }

        if (error.response.status === UNAUTHORIZED) {
          //console.log('Unauthorized user....');
          // maybe show some alert to the user
        }

        if (error.response.data.errors) {
          return Promise.reject(error.response.data.errors[0].msg);
        }

        return Promise.reject(error);
      });
  }

  get(url, params = {}, responseType) {
    return this.instance.get(url, { params, responseType });
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