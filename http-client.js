class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    try {
      const response = await fetch(this.baseURL + endpoint);
      if (!response.ok) throw new Error("GET request failed");
      return await response.json();
    } catch (error) {
      console.error("GET error:", error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("POST request failed");
      return await response.json();
    } catch (error) {
      console.error("POST error:", error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("PUT request failed");
      return await response.json();
    } catch (error) {
      console.error("PUT error:", error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("DELETE request failed");
      return await response.json();
    } catch (error) {
      console.error("DELETE error:", error);
      throw error;
    }
  }
}
