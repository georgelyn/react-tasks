import { useState, useEffect, useRef } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Tasks from '../../components/task/Tasks';
import Header from '../../components/layout/header/Header';
import Sidebar from '../../components/Sidebar';
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

  const filterTasksByCategory = (filterQuery: {
    field: string;
    value: string;
  }) => {
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
    console.log('filterTasksByCompletionState');
    const state = event.target.id;

    if (stateFilter.current === state || state === 'all') {
      stateFilter.current = '';
      setFilter({ ...filter, state: {} });
      return;
    }

    stateFilter.current = state;
    const completed = state === 'completed';
    setFilter({
      ...filter,
      state: { field: 'completed', value: completed },
    });
  };

  useEffect(() => {
    const query = TasksDataService.getFilteredQuery(db.tasks, filter);
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const taskCollection = [] as ITask[];
      snapshot.docs
        .map((t: any) => t.data() as ITask)
        .forEach((task: ITask) => {
          taskCollection.push(task);
        });
      setTasks(taskCollection);
    });

    TasksDataService.getCategories(currentUserId()).then((data) => {
      setCategories(data);
    });

    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [filter]);

  return (
    <>
      <Header showAddTask={true} />
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
        <Sidebar
          categories={categories}
          filterTasksByCategory={filterTasksByCategory}
          selectedCategory={selectedCategory.current}
        />
        <Tasks tasks={tasks} />
      </div>
    </>
  );
}
