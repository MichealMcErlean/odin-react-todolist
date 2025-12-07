import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { ToDo, Project } from './scripts/todo'
import AccordionList from './components/AccordionList';

function App() {

  const [projectList, setProjectList] = useState([new Project('General')]);
  // const [displayList, setDisplayList] = useState([]);
  // const [activeProject, setActiveProject] = useState(projectList[0]);
  const [activeProjectId, setActiveProjectId] = useState(projectList[0].id);

  const activeProject = useMemo(() => {
    return projectList.find(p => p.id === activeProjectId)||null;
  }, [projectList, activeProjectId]);

  useEffect(() => {
    let workingProjects = [...projectList];
    let defaultProject = workingProjects[0];
    defaultProject.addToDo(new ToDo('testing', 'just a test', new Date(), 'medium'));
    defaultProject.addToDo(new ToDo('another test', 'gotta do them', new Date(), 'high'));
    let cleanWorkingProjects = workingProjects.filter(project => project.id != defaultProject.id)
    setProjectList([defaultProject, ...cleanWorkingProjects]);

    let exampleProject = new Project('Exercise');
    exampleProject.addToDo(new ToDo('walking', 'to the river and back', new Date(), 'low'));
    setProjectList(prev => [...prev, exampleProject]);

    setActiveProjectId(defaultProject.id);
    // setDisplayList(defaultProject.list)
  }, [])

  function handleProjectChange(e, project) {
    setActiveProjectId(project.id);
    // setDisplayList(project.list);
  }

  function handleDeleteProject(e, project) {
    let newProjectList = projectList.filter(x => x.id != project.id);
    setProjectList([...newProjectList]);
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

  return (
    <main>
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
            />
          ))
        )}
      </article>
      <footer>
        &copy; Micheal McErlean 2025.
      </footer>
    </main>
  )
}

export default App
