const TodoSDK = require("../src/index");

async function example() {
  // Initialize the SDK for JSONPlaceholder
  const todoClient = new TodoSDK("test", {
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
    userId: 1, // Default user ID
  });

  try {
    // Create a new todo
    console.log("Creating a new todo...");
    const newTodo = await todoClient.createTodo({
      title: "Learn Node.js SDK development",
      userId: 1,
    });
    console.log("Created todo:", newTodo);

    // Fetch all todos
    console.log("\nFetching all todos...");
    const todos = await todoClient.getTodos({ _limit: 5 });
    console.log("All todos:", todos);

    // Get todos by user
    console.log("\nFetching todos for user 1...");
    const userTodos = await todoClient.getTodosByUser(1);
    console.log("User 1 todos:", userTodos.slice(0, 3)); // Show first 3

    // Get completed todos
    console.log("\nFetching completed todos...");
    const completedTodos = await todoClient.getCompletedTodos({ _limit: 3 });
    console.log("Completed todos:", completedTodos);

    // Get a specific todo
    console.log("\nFetching specific todo...");
    const specificTodo = await todoClient.getTodo(1);
    console.log("Specific todo:", specificTodo);

    // Update a todo (example; changes won't persist)
    console.log("\nUpdating todo...");
    const updatedTodo = await todoClient.updateTodo(1, {
      title: "Updated title",
      completed: true,
    });
    console.log("Updated todo:", updatedTodo);

    // Mark as completed
    console.log("\nCompleting todo...");
    const completedTodo = await todoClient.completeTodo(2);
    console.log("Completed todo:", completedTodo);
  } catch (error) {
    if (error.name === "TodoAPIError") {
      console.error("API Error:", error.message, "Status:", error.statusCode);
    } else if (error.name === "NetworkError") {
      console.error("Network Error:", error.message);
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}

example();