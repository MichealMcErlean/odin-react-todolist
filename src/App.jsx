import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { ToDo, Project, restoreProjectList, createDefaultProjectList } from './scripts/todo'
import AccordionList from './components/AccordionList';
import AddToDoModal from './components/AddToDoModal';
import useLocalStorageState from './components/useLocalStorageState';

function App() {

 

  const [projectList, setProjectList] = useLocalStorageState(
    'projectlist',
    createDefaultProjectList,
    restoreProjectList
  )
  const [activeProjectId, setActiveProjectId] = useState(projectList[0].id);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);

  const activeProject = useMemo(() => {
    return projectList.find(p => p.id === activeProjectId)||null;
  }, [projectList, activeProjectId]);

  function handleProjectChange(e, project) {
    setActiveProjectId(project.id);
  }

  function handleDeleteProject(e, project) {
    let newProjectList = projectList.filter(x => x.id != project.id);
    setProjectList([...newProjectList]);
    if (activeProjectId === project.id) {
      setActiveProjectId(newProjectList[0].id)
    }
  }

  const handleDeleteTodo = (e, todo) => {
    setProjectList(prevList => {
      const updatedList = prevList.map(project => {
        if (project.list.some(td => td.id === todo.id)) {
          const newList = project.list.filter(td => td.id !== todo.id);
          return { ...project, list: newList };
        }
        return project;
      });
      return updatedList;
    });
  };

  const handleCompleteTodo = (e, todo) => {
    setProjectList(prevList => {
      const updatedList = prevList.map(project => {
        if (project.list.some(td => td.id === todo.id)) {
          const newList = project.list.map(td => {
            if (td.id === todo.id) {
              return {
                ...td,
                isComplete: true
              }
            }
            return td
          });
          return {
            ...project,
            list: newList
          };
        }
        return project;
      });
      return updatedList;
    });
  } 

  const handleAddProject = () => {
    let name = prompt('Name your new project?', 'New Project');
    let newProject = new Project(name);
    setProjectList(prev => [...prev, newProject]);
    setActiveProjectId(prev => newProject.id);
  }

  const onAddToDo = (event) => {
    event.stopPropagation();
    const title = event.target.title.value;
    const details = event.target.details.value;
    const date = new Date(event.target.date.value);
    const priority = event.target.priority.value;

    const newToDo = new ToDo(title, details, date, priority);
    const newList = [...activeProject.list, newToDo];
    newList.sort((a, b) => a.dueDate - b.dueDate);
    const newProject = {...activeProject, list: newList};
    const newProjectList = projectList.map(project => (project.id === newProject.id ? newProject : project));
    setProjectList(newProjectList);
    setActiveProjectId(newProject.id);
    closeAddTodoModal();
  }

  const openAddTodoModal = () => setIsAddTodoModalOpen(true);
  const closeAddTodoModal = () => setIsAddTodoModalOpen(false);

  const handleEditTodo = (event, todo) => {
    event.stopPropagation();
    const target = event.target;
    const title = target.title.value;
    const details = target.details.value;
    const date = new Date(target.date.value);
    const priority = target.priority.value;

    const editedToDo = new ToDo(title, details, date, priority);
    editedToDo.id = todo.id;
    editedToDo.complete = todo.complete;

    const newList = activeProject.list.map(td => td.id === editedToDo.id ? editedToDo : td);
    newList.sort((a, b) => a.dueDate - b.dueDate);
    const newProject = {...activeProject, list: newList};
    const newProjectList = projectList.map(project => (project.id === newProject.id ? newProject : project));
    setProjectList(newProjectList);
    setActiveProjectId(newProject.id)
    closeModal();
  }

  return (
    <main>
      <AddToDoModal 
        isOpen={isAddTodoModalOpen}
        onClose={closeAddTodoModal}
        title='Add a To-Do'
      >
        <form action="/" id="addToDoForm" onSubmit={onAddToDo}>
          <label htmlFor="title">Title: </label>
          <input type="text" name="title" id="addToDoTitle" required />
          <label htmlFor="details">Details: </label>
          <input type="text" name="details" id="addToDoDetails" required />
          <label htmlFor="date">Date Due: </label>
          <input type="date" name="date" id="addToDoDate" />
          <fieldset>
            <legend>Priority</legend>
            <ul>
              <li>
                <input type="radio" name="priority" id="priorityHigh" value='high' />
                <label htmlFor="priorityHigh">High</label>
              </li>
              <li>
                <input type="radio" name="priority" id="priorityMedium" value='medium' defaultChecked/>
                <label htmlFor="priorityMedium">Medium</label>
              </li>
              <li>
                <input type="radio" name="priority" id="priorityLow" value='low' />
                <label htmlFor="priorityLow">Low</label>
              </li>
            </ul>
          </fieldset>
          <button type="submit">Add To-Do</button>
        </form>
      </AddToDoModal>
      <nav>
        <h1>To-Do List</h1>
        <h2>Projects</h2>
        <div id="projectBox">
          {projectList.map((project, index) => (
            <>
              <button
                key={project.id}
                type="button"
                className={activeProject.id === project.id ? 'active-button' : 'normal-button'}
                onClick={(e) => handleProjectChange(e, project)}
              >
                {project.title}
              </button>
              <button 
                key={project.id + index}
                type="button"
                className='delProject'
                onClick={(e) => handleDeleteProject(e, project)}
              >
                X
              </button>
            </>
          ))}
        </div>
        <button 
          type="button"
          className='addProjectButton'
          onClick={handleAddProject}
        >
          +
        </button>
      </nav>
      <article>
        {activeProject.list == [] ? (
          <h1>Naught but cobwebs..</h1>
        ) : (
          activeProject.list.map(todo => (
            <AccordionList
              key={todo.id}
              content={todo}
              onDelete={handleDeleteTodo}
              onComplete={handleCompleteTodo}
              onSubmit={(e) => handleEditTodo(e, todo)}
            />
          ))
        )}
        <div id="addtodowrapper">
          <button
            type="button"
            onClick={openAddTodoModal}
            className='modalOpenButton'
          >
            +
          </button>
        </div>
      </article>
      <footer>
        &copy; Micheal McErlean 2025.
      </footer>
    </main>
  )
}

export default App
