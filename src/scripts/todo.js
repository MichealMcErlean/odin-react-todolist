export class ToDo {
  constructor(title, details, dueDate, priority) {
    this.title = title;
    this.details= details;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = false;
    this.id = crypto.randomUUID();
  }

  setComplete() {
    this.complete = true;
  }

  comparePriority(toDo) {
    let result = 0;
    if (
      (this.priority == 'high' && toDo.priority != 'high') ||
      (this.priority == 'medium' && toDo.priority == 'low')
    ) {
      result = -1;
    } else if (
      (toDo.priority == 'high' && this.priority != 'high') ||
      (toDo.priority == 'medium' && this.priority == 'low')
    ) {
      result = 1;
    }
    return result;
  }
}

export class Project {
  constructor(title) {
    this.title = title;
    this.list = [];
    this.id = crypto.randomUUID();
  }

  findToDo(id) {
    return this.list.map(x => x.id).indexOf(id);
  }

  addToDo(toDo) {
    this.list.push(toDo);
    this.list.sort((a, b) => a - b );
  }

  deleteToDo(toDo) {
    let index = this.findToDo(toDo.id);
    let removedElement = this.list.splice(index, 1);
  }
}

 export const createDefaultProjectList = () => {
    const generalProject = new Project('General');

    const defaultTodo = new ToDo(
      "Welcome to your To-Do List",
      "This is a default task. You can add more tasks or projects!",
      new Date(),
      'medium'
    );

    generalProject.addToDo(defaultTodo);
    return [generalProject];
  }

export function restoreProjectList(oldProjectList) {
  if (!oldProjectList || !Array.isArray(oldProjectList)) {
    console.warn("restoreProjectList received invalid data, returning default list.");
    return createDefaultProjectList();
  }
  const newProjectList = oldProjectList.map(projectData => {

    if (!projectData.list || !Array.isArray(projectData.list)) {
        console.warn(`Project with ID ${projectData.id} is missing a valid toDoList.`, projectData);
        // Skip this project or handle it as appropriate for your logic
        return []; 
    }

    const rehydratedToDos = projectData.list.map(todoData => {
      const newToDo = new ToDo(
        todoData.title,
        todoData.details,
        new Date(todoData.dueDate),
        todoData.priority
      );
      newToDo.id = todoData.id;
      newToDo.complete = todoData.complete;

      return newToDo;
    });

    const newProject = new Project(projectData.title);
    newProject.id = projectData.id;

    rehydratedToDos.forEach(todo => {
      newProject.addToDo(todo)
    });

    return newProject;
  });
  return newProjectList;
}