const https = require("https");
const http = require("http");
const { TodoAPIError, NetworkError } = require("./errors");

class TodoSDK {
  constructor(apiKey = "test", options = {}) {
    // Optional API key for compatibility with other APIs
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || "https://jsonplaceholder.typicode.com";
    this.timeout = options.timeout || 5000;
    this.userId = options.userId || 1; // Default user ID for JSONPlaceholder
  }

  // Private method for HTTP requests
  _makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const isHttps = url.protocol === "https:";
      const httpModule = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "TodoSDK/1.0.0",
        },
        timeout: this.timeout,
      };

      // Add Authorization header for APIs that require it
      if (this.baseUrl.includes("jsonplaceholder") === false) {
        options.headers.Authorization = `Bearer ${this.apiKey}`;
      }

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers["Content-Length"] = Buffer.byteLength(jsonData);
      }

      const req = httpModule.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {};

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(
                new TodoAPIError(
                  parsedData.message || "API Error",
                  res.statusCode,
                  parsedData
                )
              );
            }
          } catch (error) {
            reject(new TodoAPIError("Invalid JSON response", res.statusCode));
          }
        });
      });

      req.on("error", (error) => {
        reject(new NetworkError(`Network error: ${error.message}`));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new NetworkError("Request timeout"));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Public API methods

  /**
   * Get all tasks
   * @param {Object} options - Filtering options
   * @returns {Promise<Array>} Array of tasks
   */
  async getTodos(options = {}) {
    const queryParams = new URLSearchParams();

    // JSONPlaceholder supports filtering by userId and completed
    if (options.userId) {
      queryParams.append("userId", options.userId);
    }
    if (options.completed !== undefined) {
      queryParams.append("completed", options.completed);
    }

    // Support pagination parameters for API compatibility
    if (options.limit || options._limit) {
      queryParams.append("_limit", options.limit || options._limit);
    }
    if (options.start || options._start) {
      queryParams.append("_start", options.start || options._start);
    }

    const endpoint = `/todos${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this._makeRequest("GET", endpoint);
  }

  /**
   * Get a task by ID
   * @param {string|number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getTodo(id) {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    return this._makeRequest("GET", `/todos/${id}`);
  }

  /**
   * Create a new task
   * @param {Object} todoData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTodo(todoData) {
    if (!todoData || !todoData.title) {
      throw new Error("Todo title is required");
    }

    const data = {
      title: todoData.title,
      completed: todoData.completed || false,
      userId: todoData.userId || this.userId,
    };

    return this._makeRequest("POST", "/todos", data);
  }

  /**
   * Update task
   * @param {string|number} id - task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated task
   */
  async updateTodo(id, updateData) {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("Update data is required");
    }

    // Include only fields supported by the API
    const filteredData = {};
    if (updateData.title !== undefined) filteredData.title = updateData.title;
    if (updateData.completed !== undefined)
      filteredData.completed = updateData.completed;
    if (updateData.userId !== undefined)
      filteredData.userId = updateData.userId;

    return this._makeRequest("PUT", `/todos/${id}`, filteredData);
  }

  /**
   * Partially update task (PATCH)
   * @param {string|number} id - task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated task
   */
  async patchTodo(id, updateData) {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("Update data is required");
    }

    // Filtering data for JSONPlaceholder
    const filteredData = {};
    if (updateData.title !== undefined) filteredData.title = updateData.title;
    if (updateData.completed !== undefined)
      filteredData.completed = updateData.completed;
    if (updateData.userId !== undefined)
      filteredData.userId = updateData.userId;

    return this._makeRequest("PATCH", `/todos/${id}`, filteredData);
  }

  /**
   * Delete a task
   * @param {string|number} id - task ID
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    return this._makeRequest("DELETE", `/todos/${id}`);
  }

  /**
   * Mark a task as completed
   * @param {string|number} id - task ID
   * @returns {Promise<Object>} The updated task
   */
  async completeTodo(id) {
    return this.patchTodo(id, { completed: true });
  }

  /**
   * Get todos by user ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} Array of user's tasks
   */
  async getTodosByUser(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return this.getTodos({ userId });
  }

  /**
   * Get completed todos
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of completed tasks
   */
  async getCompletedTodos(options = {}) {
    return this.getTodos({ ...options, completed: true });
  }

  /**
   * Get pending todos
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of pending tasks
   */
  async getPendingTodos(options = {}) {
    return this.getTodos({ ...options, completed: false });
  }
}

module.exports = TodoSDK;
