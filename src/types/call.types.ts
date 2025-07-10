// ✅ הגדרות בסיסיות ללא circular imports
export interface VolunteerCall {
  id: number
  callsId: number
  volunteerId: number
  volunteerStatus?: "notified" | "going" | "cant" | "arrived" | "finished"
  responseTime?: string
  // volunteer יוגדר בנפרד כדי למנוע circular imports
}
export interface CompleteCallDto {
  summary: string;
  sentToHospital: boolean;
  hospitalName?: string;
}


export interface Call {
  id: number;
  locationX: number;
  locationY: number;
  arrImage?: string;
  date: string;
  fileImage?: string | null;
  description: string;
  urgencyLevel: number;
  status: "Open" | "InProgress" | "Closed";
  summary?: string;
  sentToHospital?: boolean | null;
  hospitalName?: string | null;
  userId: number;
  address: string; // Updated to mandatory
  priority: string; // Updated to mandatory
  timestamp: string; // Updated to mandatory
  type: string; // Updated to mandatory
  numVolanteer?: number; // Added property
  imageUrl?: string; // Added property
}

export interface VolunteerStatus {
  volunteerId: number
  response: "notified" | "going" | "cant" | "arrived" | "finished"
  updatedAt?: string
}

export interface CallCreateRequest {
  description?: string
  urgencyLevel: number // 🔧 שינוי מ-string ל-number
  locationX: number
  locationY: number
  fileImage?: File
}

export interface CallResponse {
  id: number
  message: string
  status: string
}
