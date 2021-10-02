export interface ITask {
  id?: string;
  subject: string;
  description: string;
  completed: boolean;
  dateAdded: Date | any;
  dateCompleted?: Date | null;
  projectId: string | null;
}
