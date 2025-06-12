const TodoSDK = require("../src/index");

describe("TodoSDK", () => {
  let client;

  beforeEach(() => {
    client = new TodoSDK("test", {
      // API key is not required for JSONPlaceholder
      baseUrl: "https://jsonplaceholder.typicode.com",
      userId: 1, // Required for creating todos
    });
  });

  test("should initialize without API key", () => {
    const noKeyClient = new TodoSDK(undefined, {
      baseUrl: "https://jsonplaceholder.typicode.com",
      userId: 1,
    });
    expect(noKeyClient.apiKey).toBe("test");
    expect(noKeyClient.baseUrl).toBe("https://jsonplaceholder.typicode.com");
  });

  test("should initialize with default options", () => {
    expect(client.apiKey).toBe("test");
    expect(client.baseUrl).toBe("https://jsonplaceholder.typicode.com");
    expect(client.timeout).toBe(5000);
  });

  test("should initialize with custom options", () => {
    const customClient = new TodoSDK("test-key", {
      baseUrl: "https://custom.api.com",
      timeout: 10000,
      userId: 1,
    });

    expect(customClient.baseUrl).toBe("https://custom.api.com");
    expect(customClient.timeout).toBe(10000);
  });

  test("should throw error when creating todo without title", async () => {
    await expect(client.createTodo({})).rejects.toThrow(
      "Todo title is required"
    );
  });

  test("should throw error when getting todo without ID", async () => {
    await expect(client.getTodo()).rejects.toThrow("Todo ID is required");
  });

  // Add a test for creating a task
  test("should create a todo", async () => {
    const newTodo = await client.createTodo({
      title: "Test todo",
      userId: 1,
    });
    expect(newTodo).toBeDefined();
    expect(newTodo.title).toBe("Test todo");
    expect(newTodo.userId).toBe(1);
  });

  // Add a test to get a list of tasks
  test("should get all todos", async () => {
    const todos = await client.getTodos();
    expect(todos).toBeDefined();
    expect(Array.isArray(todos)).toBe(true);
  });

  // Let's add a test for getting a task by ID
  test("should get a todo by ID", async () => {
    const todo = await client.getTodo(1);
    expect(todo).toBeDefined();
    expect(todo.id).toBe(1);
  });
});
