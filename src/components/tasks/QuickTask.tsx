import { Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { ITask } from '../../models/tasks.model';
import TasksDataService from '../../services';

export default function QuickTask(props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [description, setDescription] = useState('');

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
        projectId: null,
      };
      try {
        TasksDataService.add(newTask);
      } catch (error) {
        console.error(error);
      }
    }
    props.setShowModal(false);
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
