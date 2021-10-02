import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../contexts/AuthContext';
import { Button, Container } from 'react-bootstrap';
import Tasks from '../../components/tasks/Tasks';
import TaskDetails from '../../components/tasks/TaskDetails';
import { db } from '../../config/firebase';
import { onSnapshot } from 'firebase/firestore';
import { ITask } from '../../models/tasks.model';

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
      <Container className="d-flex justify-content-between align-items-center">
        <h1>Home</h1>
        <Button onClick={signOut}>Log Out</Button>
      </Container>
      {/* <Container className="text-center"> */}
      <Tasks tasks={tasks} />

      {/* <Container className="text-center"> */}
      <Button onClick={addTask}>New task</Button>
    </>
  );
}
