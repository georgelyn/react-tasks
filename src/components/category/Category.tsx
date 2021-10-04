import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { ICategory } from '../../models/category.model';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';

export default function Category(props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [state, setState] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.id]: event.target.value });
  };

  const handleSubmit = () => {
    if (state.name.trim() !== '') {
      const category: ICategory = {
        name: state.name.trim(),
        description: state.description.trim() ?? '',
        dateAdded: new Date(),
        userId: currentUserId(),
      };
      try {
        TasksDataService.addCategory(category);
        props.setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setError('The name cannot be empty.');
    }
  };

  return (
    <>
      <Modal
        show={props.showModal}
        onHide={() => props.setShowModal(false)}
        className="tasks-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new category</Modal.Title>
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
              style={{ height: '50px' }}
              placeholder="Name"
              onChange={handleChange}
              id="name"
            />
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              placeholder="Description"
              onChange={handleChange}
              id="description"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
