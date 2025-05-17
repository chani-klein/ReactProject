

// export async function getCallById(id: number): Promise<Call> {
//   // דמו בלבד
//   return {
//     id,
//     locationX: 34.5,
//     locationY: 32.1,
//     imageUrl: '/images/event1.jpg',
//     description: 'אירוע דריסה בצומת גולדה',
//     urgencyLevel: 3,
//     status: 'פתוח',
//     numVolanteer: 2,
//     volunteerCalls: [
//       { id: 1, name: 'יוסי כהן', status: 'בדרך' },
//       { id: 2, name: 'דנה לוי', status: 'הגיע' },
//     ],
//   }
// }
// src/services/CallService.ts

import { Call } from "../types/Call.types";

export async function getCallById(id: number): Promise<Call> {
  const res = await fetch(`http://localhost:3000/calls/${id}`);
  if (!res.ok) {
    throw new Error("Call not found");
  }
  return res.json();
}
