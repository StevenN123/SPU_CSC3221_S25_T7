/**
 * httpLibrary.js — A small helper class that wraps around the fetch() API
 * to make HTTP GET, POST, PUT, and DELETE requests easier to use with JSON.
 */

// Export the class so it can be imported in other files
export default class HttpLibrary {
  /**
   * Constructor sets the base URL for the API (e.g. 'http://localhost:5000')
   * @param {string} baseUrl - the root server address
   */
  constructor(baseUrl) {
    // If baseUrl ends with a slash, remove it to avoid double slashes later
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Builds the complete URL for a request, including query parameters if needed
   * @param {string} route  - the endpoint path (e.g. '/read')
   * @param {Object} params - key-value pairs to be added as query parameters
   * @returns {URL}         - a complete URL object ready for fetch
   */
  _buildUrl(route, params = {}) {
    const url = new URL(this.baseUrl + route); // Combine base URL and route
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);     // Add each key=value as a query param
    });
    return url; // Return the complete URL
  }

  /**
   * Sends a POST request to the server
   * @param {string} route  - API path (e.g. '/write')
   * @param {Object} data   - data to send in the body
   * @param {Object} params - optional query parameters
   * @returns {Promise<Object>} - parsed JSON response
   */
  async post(route, data = {}, params = {}) {
    const url = this._buildUrl(route, params);        // Build the full URL
    const options = {
      method: 'POST',                                 // HTTP method
      headers: { 'Content-Type': 'application/json' },// Tell server we’re sending JSON
      body: JSON.stringify(data),                     // Convert JS object to JSON string
    };

    const response = await fetch(url, options);       // Send the HTTP request
    if (!response.ok) {                               // If response is not OK (e.g. 404, 500)
      throw new Error(`HTTP POST error: ${response.status}`); // Throw error with status code
    }
    return response.json();                           // Parse and return the JSON response
  }

  /**
   * Sends a GET request to the server
   * @param {string} route  - API path (e.g. '/read')
   * @param {Object} params - optional query parameters
   * @returns {Promise<Object>} - parsed JSON response
   */
  async get(route, params = {}) {
    const url = this._buildUrl(route, params);        // Build the full URL
    const response = await fetch(url);                // Send the GET request
    if (!response.ok) {                               // Check for error status
      throw new Error(`HTTP GET error: ${response.status}`); // Throw if request failed
    }
    return response.json();                           // Parse and return the JSON
  }

  /**
   * Sends a PUT request to the server
   * @param {string} route  - API path
   * @param {Object} data   - data to send in the body
   * @param {Object} params - optional query parameters
   * @returns {Promise<Object>} - parsed JSON response
   */
  async put(route, data = {}, params = {}) {
    const url = this._buildUrl(route, params);        // Build the full URL
    const options = {
      method: 'PUT',                                  // HTTP method
      headers: { 'Content-Type': 'application/json' },// Set content type to JSON
      body: JSON.stringify(data),                     // Convert data to JSON string
    };

    const response = await fetch(url, options);       // Send the PUT request
    if (!response.ok) {                               // Check if request failed
      throw new Error(`HTTP PUT error: ${response.status}`); // Throw error
    }
    return response.json();                           // Return parsed JSON
  }

  /**
   * Sends a DELETE request to the server
   * @param {string} route  - API path
   * @param {Object} params - optional query parameters
   * @returns {Promise<Object>} - parsed JSON response
   */
  async delete(route, params = {}) {
    const url = this._buildUrl(route, params);        // Build the full URL
    const options = { method: 'DELETE' };             // Set method to DELETE

    const response = await fetch(url, options);       // Send the DELETE request
    if (!response.ok) {                               // Check for error status
      throw new Error(`HTTP DELETE error: ${response.status}`); // Throw error
    }
    return response.json();                           // Return parsed JSON response
  }
}
