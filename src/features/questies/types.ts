export type QuestieStatus = 'pending' | 'resolved';

export interface Questie {
  id: string;
  student_id: string;
  subject: string;
  question_text: string;
  image_attachment_url?: string;
  status: QuestieStatus;
  tutor_id?: string;
  answer_text?: string;
  created_at: string;
  resolved_at?: string;
  
  // Joined from profiles
  student_name?: string;
  tutor_name?: string;
}

export type CreateQuestieDTO = Omit<Questie, 'id' | 'created_at' | 'status' | 'resolved_at' | 'tutor_id' | 'answer_text' | 'student_name' | 'tutor_name'>;
