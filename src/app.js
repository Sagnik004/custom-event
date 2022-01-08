// DOM Elements
const todosContainer = document.getElementById("todos-container");
const todosTemplate = document.getElementById("todos-template");
const todoTemplate = todosTemplate.querySelector(".todo");

// Functions
const fetchAndDispatch = async function (url, domElementToNotify, eventTitle) {
  const results = await fetch(url);
  const data = await results.json();

  // Create custom event
  const customEvent = new CustomEvent(eventTitle, {
    detail: {
      data,
    },
  });

  // Dispatch event
  domElementToNotify.dispatchEvent(customEvent);
};

const createTodo = function ({ id, title, completed }) {
  const todoEl = document.createElement("div");
  todoEl.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.classList.add("todo-title");
  todoTitle.textContent = title;

  const todoStatus = document.createElement("div");
  todoStatus.classList.add("todo-status");
  todoStatus.textContent = completed ? "Complete" : "Incomplete";

  todoEl.append(todoTitle, todoStatus);
  return todoEl;
};

const handleTodosLoaded = function (e) {
  const todos = e.detail.data;
  todos.forEach((todo) => todosContainer.append(createTodo(todo)));
};

// Event Listeners
document.addEventListener("todos-loaded", handleTodosLoaded);

window.addEventListener("DOMContentLoaded", () => {
  fetchAndDispatch(
    "https://jsonplaceholder.typicode.com/todos",
    document,
    "todos-loaded"
  );
});

window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 15; i++) {
    todosTemplate.append(todoTemplate.cloneNode(true));
  }
});
