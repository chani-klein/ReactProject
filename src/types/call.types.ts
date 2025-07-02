// ✅ הגדרות בסיסיות ללא circular imports
export interface VolunteerCall {
  id: number
  callsId: number
  volunteerId: number
  volunteerStatus?: "notified" | "going" | "cant" | "arrived" | "finished"
  responseTime?: string
  // volunteer יוגדר בנפרד כדי למנוע circular imports
}

export interface Call {
  id: number
  description: string
  urgencyLevel: number // 🔧 שינוי מ-string ל-number
  locationX: number
  locationY: number
  createdAt: string
  status: "Open" | "InProgress" | "Closed"
  imageUrl?: string
  summary?: string
  volunteersStatus?: VolunteerStatus[]
  goingVolunteersCount?: number
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
