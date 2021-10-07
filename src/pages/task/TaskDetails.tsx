import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Header from '../../components/layout/header/Header';
import Category from '../../components/category/Category';
import { ITask, ICategory, IQueryFields } from '../../models';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';
import { formatDate } from '../../utils';
import './TaskDetails.css';

interface IRouteParams {
  id: string;
}

export default function TaskDetails() {
  const [disabled, setDisabled] = useState(true);
  const [text, setText] = useState('Create Task');
  const [categories, setCategories] = useState([] as ICategory[]);
  const [showModal, setShowModal] = useState(false);

  const [state, setState] = useState({
    task: {} as ITask,
    category: { name: '', id: '' },
  });

  const { id } = useParams<IRouteParams>();
  const history = useHistory();

  useEffect(() => {
    // If it's an update of an existing task
    if (id) {
      getData();
      setText('Update Task');
    }

    const filter: IQueryFields = {
      category: { field: 'userId', value: `${currentUserId()}` },
    };
    const query = TasksDataService.getFilteredQuery(db.categories, filter);

    const unsubscribe = onSnapshot(query, (snapshot) => {
      const categoriesCollection = [] as ICategory[];
      snapshot.docs
        .map((c: any) => c.data() as ICategory)
        .forEach((category: ICategory) => {
          categoriesCollection.push(category);
        });
      setCategories(categoriesCollection);
    });

    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  const getData = async () => {
    const data = await TasksDataService.getTask(id);

    setState({
      ...state,
      task: data,
      category: { ...state.category, id: data.categoryId ?? '' },
    });
  };

  const setSelectValue = () => {
    if (state.category.name) {
      return state.category.name;
    }
    return categories.find((c) => c.id === state.task.categoryId)?.name ?? '';
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    try {
      if (id) {
        let task: ITask = { ...state.task };
        task.subject = state.task.subject?.trim() ?? '';
        task.description = state.task.description.trim();
        task.categoryId = state.category.id;
        TasksDataService.updateTask(task);
      } else {
        const newTask: ITask = {
          subject: state.task.subject?.trim() ?? '',
          description: state.task.description.trim(),
          completed: false,
          dateAdded: new Date(),
          dateCompleted: null,
          categoryId: state.category.id,
          userId: currentUserId(),
        };
        TasksDataService.addTask(newTask);
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

    setState({ ...state, task: { ...state.task, [event.target.id]: value } });
  };

  const handleCategory = (event: any) => {
    let categoryId = event.target.options[event.target.selectedIndex].id;

    setState({
      ...state,
      category: { ...state.category, name: event.target.value, id: categoryId },
    });
  };

  return (
    <>
      <Header showAddTask={false} />
      <Category showModal={showModal} setShowModal={setShowModal} />
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
                value={formatDate(state.task?.dateAdded) ?? ''}
                id="dateAdded"
              />
            </Col>
            <Form.Label column sm="2" className="task-date">
              Date completed:
            </Form.Label>
            <Col sm="2">
              <Form.Control
                type="text"
                readOnly={!state.task.completed}
                value={formatDate(state.task?.dateCompleted!) ?? ''}
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
            value={state.task?.subject ?? ''}
          />
          <br />
          <Form.Control
            as="textarea"
            style={{ height: '100px' }}
            placeholder="Description"
            onChange={handleChange}
            id="description"
            required
            value={state.task?.description ?? ''}
          />
          <br />
          <Container className="task-cat-btn">
            <Form.Select
              size="sm"
              className="task-select-category"
              onChange={handleCategory}
              value={setSelectValue()}
            >
              <option>Choose a category</option>
              {categories.map((category) => (
                <option id={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            <Button onClick={() => setShowModal(true)}>New Category</Button>
            <Button type="submit">{text}</Button>
          </Container>
        </Form>
      </Container>
    </>
  );
}
