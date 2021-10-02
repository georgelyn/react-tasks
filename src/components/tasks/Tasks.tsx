import { useState } from 'react';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import TasksDataService from '../../services';
import { ITask } from '../../models/tasks.model';
import './Tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Redirect, Route, useHistory } from 'react-router-dom';
import TaskDetails from './TaskDetails';

export default function Tasks(props: { tasks: ITask[] }) {
  const [modalOptions, setModalOptions] = useState({
    show: false,
    message: 'Are you sure you want to delete this task?',
    taskId: '',
  });

  const history = useHistory();

  const handleDelete = () => {
    console.log(modalOptions);
    try {
      TasksDataService.delete(modalOptions.taskId);
      setModalOptions({ ...modalOptions, show: false });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (id: string) => {
    try {
      // setTask(await TasksDataService.getTask(id));

      history.push(`/task/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setModalOptions({ ...modalOptions, show: false });
  };

  const handleModal = (id: string) => {
    setModalOptions({ ...modalOptions, show: true, taskId: id });
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
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <TaskDetails show={showEdit} task={task} /> */}
      <Container className="tasks-container">
        <div className="grid-wrapper">
          {props.tasks.map((task) => (
            // <div className="task-item">
            <div className="tasks-content flow" key={task.id}>
              <div className="tasks-icons">
                <div
                  className="fa-icon-pencil"
                  onClick={() => handleChange(task.id!)}
                >
                  <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                </div>
                <div
                  className="fa-icon-trash"
                  onClick={() => handleModal(task.id!)}
                >
                  <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                </div>
              </div>

              <div className="tasks-title">
                <h3>{task.subject}</h3>
              </div>
              <div className="tasks-desc">
                <p>{task.description}</p>
              </div>
              {/* </div> */}
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
