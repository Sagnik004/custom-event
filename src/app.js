// DOM Elements
const todosContainer = document.getElementById("todos-container");
const todosTemplate = document.getElementById("todos-template");
const todoTemplate = todosTemplate.querySelector(".todo");
const backToTopBtn = document.querySelector(".back-to-top");

// Variables
let idStart = 1,
  idEnd = 50;
let allTodos = [];

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

const createTodos = function () {
  allTodos.forEach((todo) => {
    if (todo.id >= idStart && todo.id <= idEnd) {
      if (todo.title.length >= 30) {
        todo.title = todo.title.slice(0, 35) + "...";
      }
      todosContainer.append(createTodo(todo));
    }
  });

  todosTemplate.innerHTML = "";
};

const handleTodosLoaded = function (e) {
  allTodos = e.detail.data;
  createTodos();
};

const loadNextTodoSet = function () {
  idStart = idEnd + 1;
  idEnd = idEnd + 15;
  createTodos();
};

const showBackToTopBtn = function (showFlag) {
  if (showFlag) {
    backToTopBtn.classList.remove("btn-hidden");
  } else {
    backToTopBtn.classList.add("btn-hidden");
  }
};

const goToTop = function () {
  document.body.scrollIntoView({
    behavior: "smooth",
  });
};

// Event Listeners
backToTopBtn.addEventListener("click", goToTop);

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

window.addEventListener("scroll", function () {
  let scrollHeight = document.documentElement.scrollHeight;
  let scrollPos = window.innerHeight + window.scrollY;

  if ((scrollHeight - 300 >= scrollPos) / scrollHeight === 0) {
    loadNextTodoSet();
  }
});

window.addEventListener("scroll", () => {
  let el = document.documentElement || document.body;
  if (el.scrollTop > 200) {
    showBackToTopBtn(true);
  } else {
    showBackToTopBtn(false);
  }
});
