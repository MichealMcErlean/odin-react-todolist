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