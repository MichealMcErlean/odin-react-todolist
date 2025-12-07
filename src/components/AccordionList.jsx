import styles from './AccordionList.module.css';
import {useState} from 'react';

export default function AccordionList({content, onDelete, onComplete}) {

  const [isOpen, setIsOpen] = useState(false);

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

  return (
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
            onClick={(e) => onDelete(e, content)}
          >
            X
          </button>
        </div>
      )}
      
    </div>
  )
}