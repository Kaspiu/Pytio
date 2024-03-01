// ----------------------------------------- Edit main task name -----------------------------------------

document.addEventListener("dblclick", function (event) {
  if (event.target.classList.contains("editable")) {
    if (
      event.target.tagName.toLowerCase() === "span" &&
      event.target.parentElement.classList.contains("task-name") &&
      event.target.parentElement.classList.contains("selected")
    ) {
      editSpan(event.target);
    }
  }
});

function editSpan(span) {
  if (
    span.parentNode.classList.contains("task-name") &&
    span.parentNode.classList.contains("selected")
  ) {
    var text = span.innerText;
    var input = document.createElement("input");
    input.type = "text";
    input.value = text;
    span.innerHTML = "";
    span.appendChild(input);

    input.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        endEdit(span, input.value);

        saveMainTaskData();
      }
    });

    input.focus();

    input.addEventListener("blur", function () {
      endEdit(span, input.value);

      saveMainTaskData();
    });
  }
}

function endEdit(span, newText) {
  var finalText = newText.trim() === "" ? span.dataset.lastValue : newText;
  span.innerText = finalText;

  if (newText.trim() !== "") {
    span.dataset.lastValue = newText;
  }
}

// ----------------------------------------- Add new main task -----------------------------------------

function addTask() {
  var taskArea = document.querySelector(".task-area");

  var newTaskDiv = document.createElement("div");

  var timestamp = Date.now();

  var taskId = "task-" + timestamp;

  newTaskDiv.classList.add("task-name");
  newTaskDiv.setAttribute("data-task-id", taskId);

  var newInput = document.createElement("input");
  newInput.setAttribute("type", "text");

  var newHr = document.createElement("hr");
  newHr.id = "selected-task-line";

  newInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      var newName = newInput.value.trim();
      if (newName !== "") {
        var newSpan = document.createElement("span");
        newSpan.textContent = newName;
        newSpan.classList.add("editable");

        newTaskDiv.removeChild(newInput);
        newTaskDiv.removeChild(newHr);

        newTaskDiv.appendChild(newSpan);
        newTaskDiv.appendChild(newHr);

        saveMainTaskData();
        saveData(taskId);
      }
    }
  });

  newTaskDiv.appendChild(newInput);
  newTaskDiv.appendChild(newHr);

  taskArea.insertBefore(
    newTaskDiv,
    document.querySelector(".task-area button")
  );
}

// ----------------------------------------- Select task -----------------------------------------

function handleDivClick() {
  const taskNames = document.querySelectorAll(".task-name");
  taskNames.forEach((div) => div.classList.remove("selected"));
  this.classList.add("selected");
  document.getElementById("main-area").style.display = "flex";

  var allTasks = document.querySelectorAll(".taskTask-tasks-area .task");
  allTasks.forEach(function (task) {
    task.remove();
  });

  var starBtn = document.getElementById("star-btn");
  if (starBtn.classList.contains("star-btn-selected")) {
    starBtn.classList.remove("star-btn-selected");
  }

  if (this.querySelector("input") === null) {
    let taskId = this.getAttribute("data-task-id");
    const dataExists = localStorage.getItem(taskId);
    if (dataExists) {
      loadData(taskId);
    }
    saveMainTaskData();
  }
}

function attachEventListenerToTask(div) {
  div.addEventListener("click", handleDivClick);
}

function attachEventListenersToExistingTasks() {
  const taskNames = document.querySelectorAll(".task-name");
  taskNames.forEach(attachEventListenerToTask);
}

document.addEventListener("DOMContentLoaded", function () {
  attachEventListenersToExistingTasks();

  const observer = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (node) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("task-name")
          ) {
            attachEventListenerToTask(node);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// ----------------------------------------- Scrolling tasks -----------------------------------------

document
  .querySelector(".task-area")
  .addEventListener("wheel", function (event) {
    if (event.deltaY !== 0) {
      event.preventDefault();
      this.scrollLeft += event.deltaY;
    }
  });

// ----------------------------------------- Add mini task -----------------------------------------

function createInputElement(type, handleTextInsertion) {
  var newInput = document.createElement("input");
  newInput.setAttribute("type", type);
  newInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      if (newInput.value.trim() === "") {
        if (newInput.parentElement) {
          newInput.parentElement.remove();
        }
      } else {
        handleTextInsertion(newInput.value);
        let taskDiv = document.querySelector("div.task-name.selected");
        if (taskDiv) {
          let taskId = taskDiv.getAttribute("data-task-id");
          saveData(taskId);
        }
      }
    }
  });
  return newInput;
}

function createDeleteButton() {
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-regular", "fa-trash-can");
  return deleteButton;
}

function createTaskDiv(newInput, deleteButton, handleTextInsertion) {
  var newTaskDiv = document.createElement("div");
  newTaskDiv.classList.add("task");
  newTaskDiv.setAttribute("draggable", "true");
  newTaskDiv.appendChild(newInput);
  newTaskDiv.appendChild(deleteButton);
  return newTaskDiv;
}

function handleTextInsertion(text, targetSelector) {
  var newP = document.createElement("p");
  newP.textContent = text;

  var inputElement = document.querySelector(targetSelector);
  inputElement.parentNode.replaceChild(newP, inputElement);
}

function handleTextInsertionI(text) {
  handleTextInsertion(text, '#ideas-tasks-area input[type="text"]');
}

function handleTextInsertionT(text) {
  handleTextInsertion(text, '#testing-tasks-area input[type="text"]');
}

function handleTextInsertionR(text) {
  handleTextInsertion(text, '#released-tasks-area input[type="text"]');
}

function addIdeasTask() {
  var newInput = createInputElement("text", handleTextInsertionI);
  var deleteButton = createDeleteButton();
  var ideasTasksArea = document.getElementById("ideas-tasks-area");
  var newTaskDiv = createTaskDiv(newInput, deleteButton, handleTextInsertionI);
  ideasTasksArea.insertBefore(newTaskDiv, ideasTasksArea.lastElementChild);
}

function addTestingTask() {
  var newInput = createInputElement("text", handleTextInsertionT);
  var deleteButton = createDeleteButton();
  var testingTasksArea = document.getElementById("testing-tasks-area");
  var newTaskDiv = createTaskDiv(newInput, deleteButton, handleTextInsertionT);
  testingTasksArea.insertBefore(newTaskDiv, testingTasksArea.lastElementChild);
}

function addReleasedTask() {
  var newInput = createInputElement("text", handleTextInsertionR);
  var deleteButton = createDeleteButton();
  var releasedTasksArea = document.getElementById("released-tasks-area");
  var newTaskDiv = createTaskDiv(newInput, deleteButton, handleTextInsertionR);
  releasedTasksArea.insertBefore(
    newTaskDiv,
    releasedTasksArea.lastElementChild
  );
}

// ----------------------------------------- Delete mini task -----------------------------------------

document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("fa-regular") &&
    event.target.classList.contains("fa-trash-can")
  ) {
    let parentDiv = event.target.closest(".task");
    if (parentDiv) {
      deleteMiniTask(event.target);
    }
  }
});

function deleteMiniTask(button) {
  var task = button.parentNode;
  task.remove();

  let taskDiv = document.querySelector("div.task-name.selected");
  if (taskDiv) {
    let taskId = taskDiv.getAttribute("data-task-id");
    saveData(taskId);
  }
}

// ----------------------------------------- Draggable mini task -----------------------------------------

document.addEventListener("dragstart", (e) => {
  const task = e.target.closest(".task");
  if (task) {
    task.classList.add("dragging");
    e.dataTransfer.setData("text/plain", "");
  }
});

document.addEventListener("dragend", (e) => {
  const task = e.target.closest(".task");
  if (task) {
    task.classList.remove("dragging");
  }
});

document.addEventListener("dragover", (e) => {
  e.preventDefault();
  const container = e.target.closest(".taskTask-tasks-area");
  const draggable = document.querySelector(".dragging");
  if (container && draggable && !container.contains(draggable)) {
    container.prepend(draggable);
    let taskDiv = document.querySelector("div.task-name.selected");
    if (taskDiv) {
      let taskId = taskDiv.getAttribute("data-task-id");
      saveData(taskId);
    }
  }
});

function preventFromDragGlitch() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.classList.remove("dragging");
  });
}

// ----------------------------------------- Delete main task -----------------------------------------

function deleteTaskName() {
  var selectedTasks = document.querySelectorAll(".task-area .selected");
  selectedTasks.forEach(function (task) {
    task.remove();
  });

  var allTasks = document.querySelectorAll(".taskTask-tasks-area .task");
  allTasks.forEach(function (task) {
    task.remove();
  });

  var mainArea = document.getElementById("main-area");
  mainArea.style.display = "none";

  var starBtn = document.getElementById("star-btn");
  if (starBtn.classList.contains("star-btn-selected")) {
    starBtn.classList.remove("star-btn-selected");
  }

  let taskDiv = document.querySelector("div.task-name.selected");
  if (taskDiv) {
    let taskId = taskDiv.getAttribute("data-task-id");
    deleteData(taskId);
  }
  saveMainTaskData();
}

// ----------------------------------------- Add task to favorite -----------------------------------------

function addTaskToFavorite() {
  var starBtn = document.getElementById("star-btn");

  if (starBtn.classList.contains("star-btn-selected")) {
    starBtn.classList.remove("star-btn-selected");
  } else {
    starBtn.classList.add("star-btn-selected");
  }

  let taskDiv = document.querySelector("div.task-name.selected");
  if (taskDiv) {
    let taskId = taskDiv.getAttribute("data-task-id");
    saveData(taskId);
  }
}

// ----------------------------------------- Count mini tasks -----------------------------------------

function countTasks(taskArea) {
  const tasks = taskArea.querySelectorAll(".task");
  const counterId = taskArea.id.replace("-tasks-area", "-number");
  document.getElementById(counterId).textContent = tasks.length;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function observeTaskArea(taskArea) {
  const observer = new MutationObserver(
    debounce(() => countTasks(taskArea), 100)
  );
  observer.observe(taskArea, { childList: true });
}

function initializeTaskAreaObservers() {
  ["ideas-tasks-area", "testing-tasks-area", "released-tasks-area"].forEach(
    (taskAreaId) => {
      const taskArea = document.getElementById(taskAreaId);
      countTasks(taskArea);
      observeTaskArea(taskArea);
    }
  );
}

const documentObserver = new MutationObserver(initializeTaskAreaObservers);
documentObserver.observe(document.body, { subtree: true, childList: true });

// ----------------------------------------- Open info about page -----------------------------------------

function openInfoContent() {
  var infoContent = document.getElementById("info-content");
  infoContent.classList.toggle("visible");
}

function closeInfoContent() {
  var infoContent = document.getElementById("info-content");
  infoContent.classList.remove("visible");
}

// ----------------------------------------- Save and load data -----------------------------------------

function saveData(taskId) {
  let mainArea = document.getElementById("main-area").innerHTML;
  localStorage.setItem(taskId, JSON.stringify({ mainArea }));
}

function loadData(taskId) {
  let savedData = localStorage.getItem(taskId);

  if (savedData) {
    savedData = JSON.parse(savedData);

    if (savedData.mainArea) {
      document.getElementById("main-area").innerHTML = savedData.mainArea;
    }
  }
}

function deleteData(taskId) {
  localStorage.removeItem(taskId);
}

function saveMainTaskData() {
  let taskArea = document.getElementById("task-area");
  localStorage.setItem("taskAreaContent", taskArea.innerHTML);
}

function loadMainTaskData() {
  let taskArea = document.getElementById("task-area");
  taskArea.innerHTML = localStorage.getItem("taskAreaContent");
}

// ----------------------------------------- Load important content on page load -----------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  const mainTaskDataExists = localStorage.getItem("taskAreaContent");

  if (mainTaskDataExists) {
    loadMainTaskData();
  }

  const taskArea = document.getElementById("task-area");
  const selectedTask = taskArea.querySelector(".task-name.selected");

  if (selectedTask) {
    document.getElementById("main-area").style.display = "flex";
    let taskDiv = document.querySelector("div.task-name.selected");
    if (taskDiv) {
      let taskId = taskDiv.getAttribute("data-task-id");
      const dataExists = localStorage.getItem(taskId);
      if (dataExists) {
        loadData(taskId);
      }
    }
  }

  preventFromDragGlitch();
});
