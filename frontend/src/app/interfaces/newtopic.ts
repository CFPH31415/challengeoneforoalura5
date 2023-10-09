export interface NewTopic {
  title: string;
  message: string;
  solved: boolean;
  created_at: string; 
  user: {
    id: number; 
  };
  course: {
    id: number; 
  };
}
