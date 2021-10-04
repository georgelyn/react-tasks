import { db } from '../config/firebase';
import { ITask, ICategory } from '../models';
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
  async addTask(task: ITask) {
    const item = await addDoc(db.tasks, task);
    return await updateDoc(item, { id: item.id });
  }

  async getTasks(): Promise<ITask[]> {
    const tasks: ITask[] = [];
    const tasksSnapshot = await getDocs(db.tasks);
    tasksSnapshot.forEach((doc) => {
      tasks.push(doc.data() as ITask);
    });

    return tasks;
  }

  async getTask(id: string) {
    const task = await getDoc(doc(db.tasks, id));
    return task.data() as ITask;
  }

  async deleteTask(id: string) {
    return await deleteDoc(doc(db.tasks, id));
  }

  async updateTask(task: ITask) {
    return await setDoc(doc(db.tasks, task.id), task);
  }

  async getCategories(): Promise<ICategory[]> {
    const categories: ICategory[] = [];
    const categoriesSnapshot = await getDocs(db.categories);
    categoriesSnapshot.forEach((doc) => {
      categories.push(doc.data() as ICategory);
    });

    return categories;
  }

  async addCategory(category: ICategory) {
    const item = await addDoc(db.categories, category);
    return await updateDoc(item, { id: item.id });
  }

  async updateCategory(category: ICategory) {
    return await setDoc(doc(db.categories, category.id), category);
  }

  async deleteCategory(id: string) {
    return await deleteDoc(doc(db.categories, id));
  }
}

export default new TasksDataService();
