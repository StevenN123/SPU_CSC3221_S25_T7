// http-client.js
export default class HttpClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  async request(method, endpoint, { params = {}, query = {}, body = null } = {}) {
    try {
      // Replace route parameters
      let url = endpoint.replace(/\/:(\w+)/g, (_, key) => `/${params[key]}`);
      url = `${this.baseUrl}${url}`;

      // Add query parameters
      const queryStr = new URLSearchParams(query).toString();
      if (queryStr) url += `?${queryStr}`;

      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request('GET', endpoint, options);
  }

  post(endpoint, options) {
    return this.request('POST', endpoint, options);
  }

  put(endpoint, options) {
    return this.request('PUT', endpoint, options);
  }

  delete(endpoint, options) {
    return this.request('DELETE', endpoint, options);
  }

  patch(endpoint, options) {
    return this.request('PATCH', endpoint, options);
  }
}
