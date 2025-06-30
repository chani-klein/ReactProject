export interface VolunteerStatus {
  volunteerId: number;
  response: 'going' | 'declined' | 'arrived' | 'none'; // דוגמאות לסטטוסים אפשריים
}

export interface Call {
  id: number;
  description: string;
  urgencyLevel: 'נמוך' | 'בינוני' | 'גבוה' | 'קריטי';
  locationX: number;
  locationY: number;
  status: 'נפתחה' | 'בדרך' | 'בטיפול' | 'דורש תגבורת' | 'נסגר';
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  numVolanteer: number;
  volunteersStatus?: VolunteerStatus[];  // השדה החדש שצריך להוסיף
}
