# test-todo-sdk

A lightweight JavaScript SDK for interacting with the [JSONPlaceholder](https://jsonplaceholder.typicode.com) Todo API.  
Perfect for testing, learning API integrations, or building lightweight demo apps.

---

## 📦 Installation

```bash
npm install test-todo-sdk
```

---

## 🛠 Usage Example

```js
const TodoSDK = require("test-todo-sdk");
// or: import TodoSDK from 'test-todo-sdk';

const client = new TodoSDK("test-api-key", {
  baseUrl: "https://jsonplaceholder.typicode.com", // default
  timeout: 5000,
  userId: 1,
});

async function run() {
  const todos = await client.getTodos({ _limit: 5 });
  console.log(todos);
}

run();
```

---

## ✅ Supported Methods

### `getTodos(options?)`

Fetches all todos. Supports filters:

- `userId`
- `completed`
- `_limit`, `_start`

Returns: `Promise<Array<Todo>>`

---

### `getTodo(id)`

Fetch a single todo by ID.

Returns: `Promise<Todo>`

---

### `createTodo(data)`

Creates a new todo. Requires at least `title`.

Returns: `Promise<Todo>`

---

### `updateTodo(id, data)`

Updates the entire todo by ID (PUT).

Returns: `Promise<Todo>`

---

### `patchTodo(id, data)`

Partially updates a todo by ID (PATCH).

Returns: `Promise<Todo>`

---

### `deleteTodo(id)`

Deletes a todo.

Returns: `Promise<void>`

---

### `completeTodo(id)`

Marks a todo as completed.

Returns: `Promise<Todo>`

---

### `getTodosByUser(userId)`

Get all todos for a specific user.

Returns: `Promise<Array<Todo>>`

---

### `getCompletedTodos(options?)`

Get all completed todos.

Returns: `Promise<Array<Todo>>`

---

### `getPendingTodos(options?)`

Get all incomplete todos.

Returns: `Promise<Array<Todo>>`

---

## 🌐 Using a Real API

To use this SDK with your own API, simply replace the `baseUrl` with your endpoint.  
Make sure your API follows a similar structure and response format to JSONPlaceholder.

---

## ⚙ Requirements

- Node.js **v12+**
- Works in Node.js environments. Browser usage requires bundler with Node polyfills.

---

## 📄 License

MIT
