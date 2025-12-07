import styles from './AccordionList.module.css';
import {useState} from 'react';
import AddToDoModal from './AddToDoModal';

export default function AccordionList({content, onDelete, onComplete, onSubmit}) {

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getColourClass = (val) => {
    if (val === 'high') {
      return styles.redText;
    } else if (val === 'medium') {
      return styles.yellowText;
    } else if (val === 'low') {
      return styles.greenText;
    }
    return '';
  }

  const prioColour = getColourClass(content.priority);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const todoDate=content.dueDate;
  const year = todoDate.getFullYear();
  const month = String(todoDate.getMonth() + 1).padStart(2, '0');
  const day = String(todoDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return (
    <>
      <AddToDoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title='Edit This To-Do'
      >
        <form action="/" id="editToDoForm" onSubmit={onSubmit}>
          <label htmlFor="title">Title: </label>
          <input type="text" name="title" id="editToDoTitle" required defaultValue={content.title}/>
          <label htmlFor="details">Details: </label>
          <input type="text" name="details" id="editToDoDetails" required defaultValue={content.details}/>
          <label htmlFor="date">Date Due: </label>
          <input type="date" name="date" id="editToDoDate" required defaultValue={formattedDate}/>
          <fieldset>
            <legend>Priority</legend>
            <ul>
              <li>
                <input type="radio" name="priority" id="editpriorityHigh" value='high' />
                <label htmlFor="priorityHigh">High</label>
              </li>
              <li>
                <input type="radio" name="priority" id="editpriorityMedium" value='medium' defaultChecked/>
                <label htmlFor="priorityMedium">Medium</label>
              </li>
              <li>
                <input type="radio" name="priority" id="editpriorityLow" value='low' />
                <label htmlFor="priorityLow">Low</label>
              </li>
            </ul>
          </fieldset>
          <button type="submit">Edit To-Do</button>
        </form>
      </AddToDoModal>
      <div className={styles.shell}>
        <div className={styles.header} onClick={toggleAccordion}>
          <h3>{content.title}</h3>
          <span className={styles.spreader}>
            {content.isComplete ? <>&#10003;</> : ' ' }   
          </span>
          <span className={prioColour}>{content.priority}</span>
          <span>{content.dueDate.toDateString()}</span>
          <span className={styles.accordionToggle}>{isOpen ?'-' : '+'}</span>
        </div>
        { isOpen && (
          <div className={styles.content}>
            {content.details}
            <span className={styles.spreader}></span>
            <button 
              type="button"
              className={styles.todobutton}
              onClick={(e) => onComplete(e, content)}
            >
              &#10003;?
            </button>
            <button 
              type="button"
              className={styles.todobutton}
              onClick={openModal}
            >
              &#9998;
            </button>
            <button 
              type="button"
              className={styles.todobutton}
              onClick={(e) => onDelete(e, content)}
            >
              X
            </button>
          </div>
        )}
        
      </div>
    </>
  )
}