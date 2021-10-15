import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { ITask } from '../../models/task.model';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';

export default function QuickTask(props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [state, setState] = useState({ description: '', error: '' });

  const handleChange = (event: any) => {
    let value = event.target.value;
    setState({ ...state, description: value });
  };

  const handleSubmit = () => {
    if (state.description.trim() !== '') {
      const newTask: ITask = {
        subject: '',
        description: state.description.trim(),
        completed: false,
        dateAdded: new Date(),
        dateCompleted: null,
        categoryId: null,
        userId: currentUserId(),
      };
      try {
        TasksDataService.addTask(newTask);
        setState({ description: '', error: '' });
        props.setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setState({ ...state, error: 'The description cannot be empty.' });
    }
  };

  const handleClose = () => {
    setState({ description: '', error: '' });
    props.setShowModal(false);
  };

  return (
    <Modal
      show={props.showModal}
      onHide={() => handleClose()}
      className="tasks-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new task</Modal.Title>
      </Modal.Header>
      {state.error && (
        <Alert
          variant="warning"
          onClick={() => setState({ ...state, error: '' })}
          dismissible
        >
          {state.error}
        </Alert>
      )}
      <Modal.Body>
        <Form>
          <Form.Control
            as="textarea"
            style={{ height: '80px' }}
            placeholder="Description"
            onChange={(e) => handleChange(e)}
            id="description"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={() => handleSubmit()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
