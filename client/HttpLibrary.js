/**
 * httpLibrary.js — a tiny wrapper around fetch()
 * to handle GET, POST, PUT, DELETE with JSON.
 */
export default class HttpLibrary {
  /**
   * @param {string} baseUrl - e.g. 'http://localhost:5000'
   */
  constructor(baseUrl) {
    // Ensure there’s no trailing slash
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Build a full URL including query params (if provided).
   * @param {string} route    - e.g. '/read'
   * @param {Object} params   - e.g. { key: 'value' }
   * @returns {URL}           - the complete URL object
   */
  _buildUrl(route, params = {}) {
    const url = new URL(this.baseUrl + route);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url;
  }

  /**
   * Generic POST → returns parsed JSON or throws an Error.
   * @param {string} route    - e.g. '/write'
   * @param {Object} data     - JSON body to send
   * @param {Object} params   - optional query params
   * @returns {Promise<Object>}
   */
  async post(route, data = {}, params = {}) {
    const url = this._buildUrl(route, params);
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP POST error: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Generic GET → returns parsed JSON or throws an Error.
   * @param {string} route    - e.g. '/read'
   * @param {Object} params   - optional query params
   * @returns {Promise<Object>}
   */
  async get(route, params = {}) {
    const url = this._buildUrl(route, params);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP GET error: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Generic PUT → returns parsed JSON or throws an Error.
   * @param {string} route
   * @param {Object} data
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async put(route, data = {}, params = {}) {
    const url = this._buildUrl(route, params);
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP PUT error: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Generic DELETE → returns parsed JSON or throws an Error.
   * @param {string} route
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async delete(route, params = {}) {
    const url = this._buildUrl(route, params);
    const options = { method: 'DELETE' };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP DELETE error: ${response.status}`);
    }
    return response.json();
  }
}
