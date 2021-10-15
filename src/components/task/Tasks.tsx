import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import TasksDataService from '../../services';
import { ITask } from '../../models/task.model';
import { formatDate } from '../../utils';
import './Tasks.css';

export default function Tasks(props: { tasks: ITask[] }) {
  const [modalOptions, setModalOptions] = useState({
    show: false,
    title: '',
    message: '',
    buttonClass: '',
    buttonText: '',
    taskId: '',
  });

  const history = useHistory();

  const deleteTask = () => {
    try {
      TasksDataService.deleteTask(modalOptions.taskId);
      setModalOptions({ ...modalOptions, show: false });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (id: string) => {
    try {
      history.push(`/task/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (task: ITask) => {
    const statusText = task.completed ? 'pending' : 'complete';

    setModalOptions({
      ...modalOptions,
      show: true,
      message: `Do you want to mark this task as ${statusText}?`,
      buttonClass: 'dark',
      buttonText: `Mark as ${statusText}`,
      taskId: task.id!,
    });
  };

  const setCompletionState = () => {
    const task = props.tasks.find((x) => x.id === modalOptions.taskId);
    if (task) {
      task.dateCompleted = !task.completed ? new Date() : null;
      task.completed = !task.completed;
      TasksDataService.updateTask(task).then(() =>
        setModalOptions({ ...modalOptions, show: false })
      );
    }
  };

  const handleClose = () => {
    setModalOptions({ ...modalOptions, show: false });
  };

  const handleDelete = (id: string) => {
    setModalOptions({
      ...modalOptions,
      show: true,
      message: 'Are you sure you want to delete this task?',
      buttonClass: 'danger',
      buttonText: 'Delete',
      taskId: id,
    });
  };

  return (
    <>
      <Modal
        show={modalOptions.show}
        onHide={handleClose}
        className="tasks-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalOptions.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalOptions.buttonClass}
            onClick={
              modalOptions.buttonClass === 'danger'
                ? () => deleteTask()
                : () => setCompletionState()
            }
          >
            {modalOptions.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className="tasks-container">
        <div className="grid-wrapper">
          {props.tasks.map((task) => (
            <div
              className={`tasks-content flow ${
                task.completed ? 'tasks-completed' : ''
              }`}
              key={task.id}
            >
              <div className="tasks-icons">
                <div
                  className="fa-icon-pencil"
                  onClick={() => handleChange(task.id!)}
                >
                  <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                </div>
                <div
                  className="fa-icon-trash"
                  onClick={() => handleDelete(task.id!)}
                >
                  <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                </div>
              </div>
              <div className="tasks-date">
                <div className="tasks-date-added">
                  <p>Added: {formatDate(task.dateAdded)}</p>
                </div>
                <div className="tasks-date-completed">
                  <p>Completed: {formatDate(task.dateCompleted) ?? 'N/A'}</p>
                </div>
              </div>
              <div className="tasks-title">
                <h3>{task.subject}</h3>
              </div>
              <div className="tasks-desc" onClick={() => handleClick(task)}>
                <p>{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
