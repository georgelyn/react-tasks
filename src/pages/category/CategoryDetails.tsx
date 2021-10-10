import { useState, useEffect, useRef } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/layout/Header';
import AddCategory from '../../components/category/AddCategory';
import Loader from '../../components/layout/Loader';
import { ICategory } from '../../models';
import { currentUserId } from '../../contexts/AuthContext';
import TasksDataService from '../../services';
import { formatDate } from '../../utils';
import './CategoryDetails.css';

export default function CategoryDetails() {
  const [categories, setCategories] = useState([] as ICategory[]);
  const [state, setState] = useState({
    category: {} as ICategory,
    enabled: false,
    updated: false,
    showModal: false,
    modalMessage: '',
    showAddCategoryModal: false,
  });

  const loaderRef = useRef(true);

  useEffect(() => {
    showLoader(true);
    TasksDataService.getCategories(currentUserId()).then((data) => {
      data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      setCategories(data);
    });
    showLoader(false);
  }, [state.updated]);

  const showLoader = (show: boolean) => {
    loaderRef.current = show;
  };

  const fetchCategory = (id: string) => {
    showLoader(true);
    setState({
      ...state,
      category: categories.find((c) => c.id === id) as ICategory,
      enabled: true,
    });
    showLoader(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    try {
      showLoader(true);
      TasksDataService.updateCategory(state.category).then(() => {
        setState({
          ...state,
          category: {} as ICategory,
          enabled: false,
          updated: !state.updated,
          showModal: true,
          modalMessage: 'The category has been successfully updated.',
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      showLoader(false);
    }
  };

  const handleChange = (event: any) => {
    showLoader(true);
    setState({
      ...state,
      category: { ...state.category, [event.target.id]: event.target.value },
    });
    showLoader(false);
  };

  const handleDelete = () => {
    if (state.category.id) {
      showLoader(true);
      TasksDataService.deleteCategory(state.category.id).then(() => {
        setState({
          ...state,
          category: {} as ICategory,
          enabled: false,
          updated: !state.updated,
          showModal: true,
          modalMessage: 'The category has been successfully deleted.',
        });
      });
      showLoader(false);
    }
  };

  const handleClose = () => {
    setState({ ...state, showModal: false });
  };

  const handleCategoryModal = (category?: { name: string; id: string }) => {
    showLoader(true);
    if (category?.id) {
      setState({
        ...state,
        updated: !state.updated,
        showAddCategoryModal: false,
        category: {} as ICategory,
      });
    } else {
      setState({
        ...state,
        showAddCategoryModal: false,
      });
    }
    showLoader(false);
  };

  return (
    <>
      <Header showAddTask={false} />
      <Loader show={loaderRef.current} />
      <AddCategory
        showModal={state.showAddCategoryModal}
        handleCategoryModal={handleCategoryModal}
      />
      <Modal
        show={state.showModal}
        onHide={handleClose}
        className="tasks-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{state.modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="categories-container">
        <div className="categories">
          <div className="categories-header">
            <p>Categories</p>
            <button
              onClick={() => setState({ ...state, showAddCategoryModal: true })}
            >
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </button>
          </div>
          <div className="category-list">
            <ul>
              {categories.map((cat, index) => {
                if (cat.id) {
                  return (
                    <li
                      key={cat.id}
                      className={
                        state.category?.id === cat.id ? 'category-selected' : ''
                      }
                      onClick={() => fetchCategory(cat.id!)}
                    >
                      {cat.name}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
        <div className="category-editor">
          <Form
            className="category-form-container mt-5"
            onSubmit={handleSubmit}
          >
            <Form.Group className="d-flex justify-content-end align-items-center">
              <Form.Label className="category-date">Date added:</Form.Label>
              <Form.Control
                type="text"
                id="dateAdded"
                readOnly={true}
                className="category-date-added"
                value={formatDate(state.category?.dateAdded) ?? ''}
              />
            </Form.Group>
            <Form.Control
              type="text"
              className="mt-5"
              placeholder="Name"
              id="name"
              readOnly={!state.enabled}
              required
              value={state.category?.name ?? ''}
              onChange={handleChange}
            />
            <br />
            <Form.Control
              as="textarea"
              placeholder="Description"
              id="description"
              readOnly={!state.enabled}
              value={state.category?.description ?? ''}
              onChange={handleChange}
            />
            <br />
            <Container className="task-cat-btn category-btn justify-content-end">
              <Button disabled={!state.enabled} type="submit">
                Update
              </Button>
              <Button
                className="category-btn-delete"
                disabled={!state.enabled}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Container>
          </Form>
        </div>
      </div>
    </>
  );
}
