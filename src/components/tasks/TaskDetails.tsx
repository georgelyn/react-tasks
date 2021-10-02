import { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Form,
  Col,
  Row,
  FloatingLabel,
} from 'react-bootstrap';
import './TaskDetails.css';
import { ITask } from '../../models/tasks.model';
import TasksDataService from '../../services';
import { useHistory, useParams } from 'react-router-dom';

interface IRouteParams {
  id: string;
}

// export default function TaskDetails(props: { show: boolean; task: ITask }) {
export default function TaskDetails() {
  const [task, setTask] = useState({} as ITask);
  const [disabled, setDisabled] = useState(true);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');

  const { id } = useParams<IRouteParams>();
  const history = useHistory();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (id) {
      const t = await TasksDataService.getTask(id);
      setTask(t);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    try {
      if (id) {
        TasksDataService.update(task);
      } else {
        const newTask: ITask = {
          subject: task.subject,
          description: task.description,
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
    setTask({ ...task, [event.target.id]: event.target.value });

    // if (event.target.id === 'subject') {
    //   setSubject(event.target.value);
    // } else {
    //   setDescription(event.target.value);
    // }
  };

  return (
    <Container className="mt-5" style={{ width: '60%' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          as={Row}
          className="mb-3 d-flex justify-content-end"
          controlId="formDate"
        >
          <Form.Label column sm="2" className="task-date">
            Date added:
          </Form.Label>
          <Col sm="2">
            <Form.Control type="text" readOnly={disabled} />
          </Col>
          <Form.Label column sm="2" className="task-date">
            Date completed:
          </Form.Label>
          <Col sm="2">
            <Form.Control type="text" readOnly={disabled} />
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
          Create task
        </Button>
      </Form>
    </Container>
  );
}
