export type Task = {
    id: string;
    title: string;
    priority: number;
    status: 'Pending' | 'Finished';
    startTime: string;
    endTime: string;
  };