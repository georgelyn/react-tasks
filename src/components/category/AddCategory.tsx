import { useState, useRef } from 'react';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { ICategory } from '../../models/category.model';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';

export default function AddCategory(props: {
  showModal: boolean;
  handleCategoryModal: (category?: { name: string; id: string }) => void;
}) {
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (nameRef.current?.value.trim()) {
      const category: ICategory = {
        name: nameRef.current?.value.trim(),
        description: descriptionRef.current?.value.trim() ?? '',
        dateAdded: new Date(),
        userId: currentUserId(),
      };
      try {
        const id = await TasksDataService.addCategory(category);
        props.handleCategoryModal({ name: category.name, id: id });
      } catch (error) {
        console.error(error);
      } finally {
        setError('');
      }
    } else {
      setError('The name cannot be empty.');
    }
  };

  return (
    <>
      <Modal
        show={props.showModal}
        onHide={() => {
          props.handleCategoryModal();
          setError('');
        }}
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
              id="name"
              ref={nameRef}
            />
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              placeholder="Description"
              id="description"
              ref={descriptionRef}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
