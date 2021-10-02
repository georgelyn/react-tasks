import { db } from '../config/firebase';
import { ITask } from '../models/tasks.model';
import {
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';

class TasksDataService {
  async add(task: ITask) {
    const newTask = await addDoc(db.tasks, task);
    return await updateDoc(newTask, { id: newTask.id });
  }

  async getTasks(): Promise<ITask[]> {
    const tasks: ITask[] = [];
    const tasksSnapshot = await getDocs(db.tasks);
    tasksSnapshot.forEach((doc) => {
      tasks.push(doc.data() as ITask);
    });

    // console.log(tasks);
    return tasks;

    // const tasks = (await db.tasks.orderBy('dateAdded', 'asc').get()).docs.map(
    //   (t) => t.data() as Task
    // );
    // console.log(tasks);
    // return tasks;
  }

  async getTask(id: string) {
    const task = await getDoc(doc(db.tasks, id));
    return task.data() as ITask;
  }

  async delete(id: string) {
    // return await deleteDoc(db.tasks), id);
    return await deleteDoc(doc(db.tasks, id));

    // const docRef = doc(db.tasks, id);
    // await deleteDoc(docRef);
  }

  async update(task: ITask) {
    return await setDoc(doc(db.tasks, task.id), task);
  }
}

export default new TasksDataService();
