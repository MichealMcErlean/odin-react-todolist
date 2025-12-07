import styles from './AddToDoModal.module.css';

export default function AddToDoModal({isOpen, onClose, children, title}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className = {styles.modalHeader}>
          {title && <h2>{title}</h2>}
          <button 
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}