import { useState, useEffect, useRef } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Tasks from '../../components/task/Tasks';
import Header from '../../components/layout/Header';
import CategoryList from '../../components/category/CategoryList';
import Loader from '../../components/layout/Loader';
import { ITask, ICategory, IQueryFields } from '../../models';
import TasksDataService from '../../services';
import { currentUserId } from '../../contexts/AuthContext';
import './Home.css';

export default function Home() {
  const [tasks, setTasks] = useState([] as ITask[]);
  const [categories, setCategories] = useState([] as ICategory[]);
  const [filter, setFilter] = useState<IQueryFields>({
    user: { field: 'userId', value: `${currentUserId()}` },
  } as IQueryFields);

  const selectedCategory = useRef('');
  const stateFilter = useRef('');
  const loaderRef = useRef(true);

  useEffect(() => {
    showLoader(true);
    const query = TasksDataService.getFilteredQuery(db.tasks, filter);
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const taskCollection = [] as ITask[];
      snapshot.docs
        .map((t: any) => t.data() as ITask)
        .forEach((task: ITask) => {
          taskCollection.push(task);
        });
      taskCollection.sort((a, b) => a.dateAdded - b.dateAdded);
      setTasks(taskCollection);
    });

    TasksDataService.getCategories(currentUserId()).then((data) => {
      data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      setCategories(data);
    });

    showLoader(false);

    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [filter]);

  const showLoader = (show: boolean) => {
    loaderRef.current = show;
  };

  const filterTasksByCategory = (filterQuery: {
    field: string;
    value: string;
  }) => {
    showLoader(true);
    if (filterQuery.value !== selectedCategory.current) {
      setFilter({
        ...filter,
        category: { field: 'categoryId', value: `${filterQuery.value}` },
        state: {},
      });
      selectedCategory.current = filterQuery.value;
    } else {
      setFilter({
        ...filter,
        category: {},
        state: {},
      });
      selectedCategory.current = '';
    }
  };

  const filterTasksByCompletionState = (event: any) => {
    showLoader(true);
    // console.log('filterTasksByCompletionState');
    const state = event.target.id;

    if (stateFilter.current === state || state === 'all') {
      stateFilter.current = '';
      selectedCategory.current = '';
      setFilter({ ...filter, category: {}, state: {} });
      return;
    }

    stateFilter.current = state;
    const completed = state === 'completed';
    setFilter({
      ...filter,
      state: { field: 'completed', value: completed },
    });
  };

  return (
    <>
      <Header showAddTask={true} />
      <Loader show={loaderRef.current} />
      <div className="home-container">
        <div className="home-filter-btn">
          <button
            id="all"
            className={
              stateFilter.current === 'all' ? 'home-filter-btn-selected' : ''
            }
            onClick={filterTasksByCompletionState}
          >
            All tasks
          </button>
          <button
            id="completed"
            className={
              stateFilter.current === 'completed'
                ? 'home-filter-btn-selected'
                : ''
            }
            onClick={filterTasksByCompletionState}
          >
            Completed tasks
          </button>
          <button
            id="pending"
            className={
              stateFilter.current === 'pending'
                ? 'home-filter-btn-selected'
                : ''
            }
            onClick={filterTasksByCompletionState}
          >
            Pending tasks
          </button>
        </div>
        <CategoryList
          categories={categories}
          filterTasksByCategory={filterTasksByCategory}
          selectedCategory={selectedCategory.current}
        />
        <Tasks tasks={tasks} />
      </div>
    </>
  );
}
