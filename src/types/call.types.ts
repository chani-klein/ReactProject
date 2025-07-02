import type { Volunteer } from "../types/volunteer.types";


// ✅ עדכון הממשקים להתאמה למבנה הנתונים בצד השרת
export interface VolunteerCall {
  id: number;
  callsId: number;
  volunteerId: number;
  volunteerStatus?: 'notified' | 'going' | 'cant' | 'arrived' | 'finished';
  responseTime?: string;
  volunteer?: Volunteer; // אם אתה רוצה לכלול פרטי מתנדב
}

export interface Call {
  id: number;
  description: string;
  urgencyLevel: string;
  locationX: number;
  locationY: number;
  createdAt: string;
  status: 'Open' | 'InProgress' | 'Closed';
  imageUrl?: string;
  summary?: string;
   volunteersStatus?: VolunteerStatus[]; // הוספת השדה
  goingVolunteersCount?: number; // מספר מתנדבים ב-"going"
}

export interface VolunteerStatus {
  volunteerId: number;
  response: 'notified' | 'going' | 'cant' | 'arrived' | 'finished';
}