import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { ITask } from '../../models/task.model';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';

export default function QuickTask(props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: any) => {
    let value = event.target.value;
    setDescription(value);
  };

  const handleSubmit = () => {
    if (description.trim() !== '') {
      const newTask: ITask = {
        subject: '',
        description: description.trim(),
        completed: false,
        dateAdded: new Date(),
        dateCompleted: null,
        categoryId: null,
        userId: currentUserId(),
      };
      try {
        TasksDataService.addTask(newTask);
        props.setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setError('The description cannot be empty.');
    }
  };

  return (
    <Modal
      show={props.showModal}
      onHide={() => props.setShowModal(false)}
      className="tasks-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new task</Modal.Title>
      </Modal.Header>
      {error && (
        <Alert variant="warning" onClick={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      <Modal.Body>
        <Form>
          <Form.Control
            as="textarea"
            style={{ height: '100px' }}
            placeholder="Description"
            onChange={(e) => handleChange(e)}
            id="description"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleSubmit()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
