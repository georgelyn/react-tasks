import { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Form, Col, Row, Alert } from 'react-bootstrap';
import Header from '../../components/layout/Header';
import AddCategory from '../../components/category/AddCategory';
import Loader from '../../components/layout/Loader';
import { ITask, ICategory } from '../../models';
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

  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  const { id } = useParams<IRouteParams>();
  const history = useHistory();

  let categoryRef = useRef({ name: '', id: '' });

  useEffect(() => {
    setLoader(true);
    // If it's an update of an existing task
    if (id) {
      getData();
      setText('Update Task');
    }

    TasksDataService.getCategories(currentUserId())
      .then((data) => {
        setCategories(data);
      })
      .then(() => setLoader(false));
  }, [categoryRef.current.id]);

  const getData = async () => {
    const data = await TasksDataService.getTask(id);

    setState({
      ...state,
      task: data,
      category: { ...state.category, id: data.categoryId ?? '' },
    });
    setLoader(false);
  };

  const setSelectValue = () => {
    if (categoryRef.current.id) {
      return categoryRef.current.name;
    }

    if (state.category.name) {
      return state.category.name;
    }
    return categories.find((c) => c.id === state.task.categoryId)?.name ?? '';
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (error) {
      return;
    }

    try {
      setLoader(true);
      const categoryId =
        categoryRef.current.id !== ''
          ? categoryRef.current.id
          : state.category.id;
      if (id) {
        let task: ITask = { ...state.task };
        task.subject = state.task.subject?.trim() ?? '';
        task.description = state.task.description.trim();
        task.categoryId = categoryId;
        TasksDataService.updateTask(task);
      } else {
        const newTask: ITask = {
          subject: state.task.subject?.trim() ?? '',
          description: state.task.description.trim(),
          completed: false,
          dateAdded: new Date(),
          dateCompleted: null,
          categoryId: categoryId,
          userId: currentUserId(),
        };
        TasksDataService.addTask(newTask);
      }
      history.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (event: any) => {
    let value = event.target.value;
    // if (event.target.id.includes('date')) {
    //   // value = new Date(event.target.value.toString());
    // }

    setState({ ...state, task: { ...state.task, [event.target.id]: value } });
  };

  const handleCategory = (event: any) => {
    let categoryId = event.target.options[event.target.selectedIndex].id;

    setState({
      ...state,
      category: { ...state.category, name: event.target.value, id: categoryId },
    });

    categoryRef.current = { name: '', id: '' };
  };

  const handleCategoryModal = (category?: { name: string; id: string }) => {
    if (category) {
      categoryRef.current = { name: category.name, id: category.id };
    }

    setShowModal(false);
  };

  const validateDate = () => {
    let date = state.task.dateCompleted?.toString() ?? '';
    const checkDate = Date.parse(date);
    if (isNaN(checkDate) && date !== '') {
      setError(
        'The date is not in a correct format. Please change it or leave it empty.'
      );
    } else {
      setError('');
      if (date) {
        setState({
          ...state,
          task: {
            ...state.task,
            dateCompleted: new Date(date),
          },
        });
      }
    }
  };

  return (
    <>
      <Header showAddTask={false} />
      <Loader show={loader} />
      <AddCategory
        showModal={showModal}
        handleCategoryModal={handleCategoryModal}
      />
      <Container className="mt-5" style={{ width: '100%' }}>
        <Form className="task-form-container" onSubmit={handleSubmit}>
          {error && <Alert variant="warning">{error}</Alert>}
          <Form.Group as={Row} className="mb-3 d-flex justify-content-end">
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
                value={formatDate(state.task.dateCompleted) ?? ''}
                onChange={handleChange}
                id="dateCompleted"
                onBlur={validateDate}
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
            style={{ height: '150px' }}
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
              {categories.map((category, index) => (
                <option id={category.id} key={index}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            <Button onClick={() => setShowModal(true)}>New Category</Button>
            <Button type="submit" disabled={error ? true : false}>
              {text}
            </Button>
          </Container>
        </Form>
      </Container>
    </>
  );
}
