import { useState, useEffect } from 'react';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';
import './TaskDetails.css';
import { ITask } from '../../models/tasks.model';
import TasksDataService from '../../services';
import { useHistory, useParams } from 'react-router-dom';
import { formatDate } from '../../utils';
import Header from '../layout/header/Header';

interface IRouteParams {
  id: string;
}

export default function TaskDetails() {
  const [task, setTask] = useState({} as ITask);
  const [disabled, setDisabled] = useState(true);
  const [text, setText] = useState('Create Task');

  const [project, setProject] = useState('');

  const { id } = useParams<IRouteParams>();
  const history = useHistory();

  useEffect(() => {
    // If it's an update of an existing task
    if (id) {
      getData();
      setText('Update Task');
    }
  }, []);

  const getData = async () => {
    const data = await TasksDataService.getTask(id);
    setTask(data);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    try {
      if (id) {
        task.subject = task.subject?.trim() ?? '';
        task.description = task.description.trim();
        TasksDataService.update(task);
      } else {
        const newTask: ITask = {
          subject: task.subject?.trim() ?? '',
          description: task.description.trim(),
          completed: false,
          dateAdded: new Date(),
          dateCompleted: null,
          projectId: null,
        };
        TasksDataService.add(newTask);
      }
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: any) => {
    let value = event.target.value;
    if (event.target.id.includes('date')) {
      value = new Date(event.target.value.toString());
    }

    setTask({ ...task, [event.target.id]: value });
  };

  return (
    <>
      <Header showQuickTask={false} />
      <Container className="mt-5" style={{ width: '60%' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group
            as={Row}
            className="mb-3 d-flex justify-content-end"
            // controlId="formDate"
          >
            <Form.Label column sm="2" className="task-date">
              Date added:
            </Form.Label>
            <Col sm="2">
              <Form.Control
                type="text"
                readOnly={disabled}
                value={formatDate(task?.dateAdded)}
                id="dateAdded"
              />
            </Col>
            <Form.Label column sm="2" className="task-date">
              Date completed:
            </Form.Label>
            <Col sm="2">
              <Form.Control
                type="text"
                readOnly={!task.completed}
                value={formatDate(task?.dateCompleted!)}
                onChange={handleChange}
                id="dateCompleted"
              />
            </Col>
          </Form.Group>
          <Form.Control
            type="text"
            style={{ height: '40px' }}
            className="mt-5"
            placeholder="Subject"
            onChange={handleChange}
            id="subject"
            value={task?.subject}
          />
          <br />
          <Form.Control
            as="textarea"
            style={{ height: '100px' }}
            placeholder="Description"
            onChange={handleChange}
            id="description"
            required
            value={task?.description}
          />
          <br />
          <Form.Group className="d-flex" controlId="formProjectSelect">
            {/* <Form.Label>Project</Form.Label> */}
            <Form.Select size="sm" className="task-select-project">
              <option>Choose a project</option>
              <option>Project 1</option>
              <option>Project 2</option>
            </Form.Select>
            <Button style={{ width: '200px' }}>New Project</Button>
          </Form.Group>
          <Button type="submit" className="mt-5 w-100">
            {text}
          </Button>
        </Form>
      </Container>
    </>
  );
}
