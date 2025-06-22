// export interface Call {
//   id: string;
//   locationX: number;
//   locationY: number;
//   imageUrl?: string;
//   description?: string;
//   urgencyLevel?: number;
//   status?: string;
//   numVolanteer: number; // חשוב - זה חייב להיות ללא ? 
//   createdAt: Date | string;
// }
export interface Call {
  id: number ;
  description: string;
  urgencyLevel: 'נמוך' | 'בינוני' | 'גבוה' | 'קריטי';
  locationX: number;
  locationY: number;
  status: 'נפתחה' | 'בדרך' | 'בטיפול' | 'דורש תגבורת' | 'נסגר';
  createdAt: string;
  updatedAt?: string;
    imageUrl?: string;
     numVolanteer: number
}