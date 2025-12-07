import { useState, useEffect } from 'react'
import './App.css'
import { ToDo, Project } from './scripts/todo'
import AccordionList from './components/AccordionList';

function App() {

  const [projectList, setProjectList] = useState([new Project('General')]);
  const [displayList, setDisplayList] = useState([]);
  const [activeProject, setActiveProject] = useState(projectList[0]);

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

    setActiveProject(defaultProject);
    setDisplayList(defaultProject.list)
  }, [])

  function handleProjectChange(e, project) {
    setActiveProject(project);
    setDisplayList(project.list);
  }

  function handleDeleteProject(e, project) {
    let newProjectList = projectList.filter(x => x.id != project.id);
    setProjectList([...newProjectList]);
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
        {displayList == [] ? (
          <h1>Naught but cobwebs..</h1>
        ) : (
          displayList.map(todo => (
            <AccordionList
              key={todo.id}
              content={todo}
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
