// http-client.js

export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(path) {
    const resp = await fetch(this.baseURL + path);
    if (!resp.ok) {
      throw new Error(`GET ${path} failed: ${resp.status} ${resp.statusText}`);
    }
    return await resp.json();
  }

  async post(path, payload) {
    const resp = await fetch(this.baseURL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      throw new Error(`POST ${path} failed: ${resp.status} ${resp.statusText}`);
    }
    return await resp.json();
  }
}
