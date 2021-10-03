import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../contexts/AuthContext';
import Tasks from '../../components/tasks/Tasks';
import { db } from '../../config/firebase';
import { onSnapshot } from 'firebase/firestore';
import { ITask } from '../../models/tasks.model';
import Header from '../../components/layout/header/Header';

export default function Home() {
  const [tasks, setTasks] = useState([] as ITask[]);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onSnapshot(db.tasks, (snapshot) => {
      const taskCollection = [] as ITask[];
      snapshot.docs
        .map((t: any) => t.data() as ITask)
        .forEach((task: ITask) => {
          taskCollection.push(task);
        });
      console.log(taskCollection);
      setTasks(taskCollection);
    });

    // unsubscribe to the listener when unmounting
    console.log(tasks);

    return () => unsubscribe();
  }, []);

  const addTask = () => {
    history.push('/task');
  };

  const signOut = () => {
    logOut()
      .then(() => {
        console.log('logged out');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header showQuickTask={true} />
      <Tasks tasks={tasks} />
    </>
  );
}
