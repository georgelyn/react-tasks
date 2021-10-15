import { db } from '../config/firebase';
import { ITask, ICategory, IQueryFields } from '../models';
import {
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  DocumentData,
  CollectionReference,
  QueryConstraint,
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

  async getCategories(userId: string): Promise<ICategory[]> {
    let categories: ICategory[] = [];
    const query = this.getFilteredQuery(db.categories, {
      user: { field: 'userId', value: `${userId}` },
    });

    const categoriesSnapshot = await getDocs(query);
    categoriesSnapshot.forEach((doc) => {
      categories.push(doc.data() as ICategory);
    });

    return categories;
  }

  async addCategory(category: ICategory) {
    const item = await addDoc(db.categories, category);
    await updateDoc(item, { id: item.id });
    return item.id;
  }

  async updateCategory(category: ICategory) {
    return await setDoc(doc(db.categories, category.id), category);
  }

  async deleteCategory(id: string) {
    return await deleteDoc(doc(db.categories, id));
  }

  getFilteredQuery(
    collection: CollectionReference<DocumentData>,
    queryFields: IQueryFields
  ) {
    let filteredQuery: QueryConstraint[] = [];

    if (Object.keys(queryFields).length < 1) {
      return collection;
    }

    for (const [key, { field, value }] of Object.entries(queryFields)) {
      if ((field && value) || (field && typeof value === 'boolean')) {
        filteredQuery.push(where(field, '==', value));
      }
    }

    return query(collection, ...filteredQuery);
  }
}

export default new TasksDataService();
