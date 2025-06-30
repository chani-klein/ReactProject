import type { VolunteerCall } from "../types/call.types";
export interface Volunteer {
  id: number;
  password: string;
  gmail: string;
  fullName: string;
  phoneNumber: string;
  specialization: string;
  address: string;
  city: string;
  locationX?: number; // אופציונלי - תואם ל־double?
  locationY?: number;
  volunteerCalls: VolunteerCall[]; // צריך להגדיר גם את זה
}
