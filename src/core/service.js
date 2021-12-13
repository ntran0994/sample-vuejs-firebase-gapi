import axios from 'axios';
import { AUTH_HEADER_KEY } from 'core/constants';

export default class Service {
  /**
   * Creates an instance of Service.
   *
   * @param {any} namespace  namespace of service (without trailing '/')
   *
   * @memberOf Service
   */
  static requestInterceptors;

  static setToken(token) {
    axios.defaults.headers.common[AUTH_HEADER_KEY] = `Bearer ${token}`;
  }

  static removeToken() {
    axios.defaults.headers.common[AUTH_HEADER_KEY] = undefined;
  }

  static interceptors({ request }) {
    if (request) this.requestInterceptors = request;
  }

  constructor(namespace) {
    const baseURL = process.env.VUE_APP_SERVICE_ENDPOINT || '';
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: `${baseURL}/${namespace}/`,
      responseType: 'json'
    });
    this.axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  /**
   * Call a service action via REST API
   *
   * @param {any} action  name of action
   * @param {any} params  parameters to request
   * @returns  {Promise}
   *
   * @memberOf Service
   */
  rest(action, params, options = { method: 'post', headers: {} }) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: options.method,
          data: params,
          headers: options.headers
        })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            store.dispatch('global/setAuthorShow', true, { root: true });
          } else {
            reject(error.response.data.errors);
          }
        });
    });
  }

  get(action, params) {
    return this.rest(action, params, { method: 'get' });
  }
}
