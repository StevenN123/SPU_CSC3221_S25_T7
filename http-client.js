export default class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  async request(method, endpoint, { params = {}, query = {}, body = null } = {}) {
    // 1. Replace route parameters
    let url = endpoint.replace(/\/:(\w+)/g, (_, key) => `/${params[key]}`);
    
    // 2. Add base URL
    url = `${this.baseUrl}${url}`;
    
    // 3. Add query parameters
    const queryString = new URLSearchParams(query).toString();
    if (queryString) url += `?${queryString}`;

    // 4. Make the request
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
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
