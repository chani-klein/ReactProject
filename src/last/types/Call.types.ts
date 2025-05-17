export interface VolunteerCall {
  id: number
  name: string
  status: string
}

export interface Call {
  id: number
  locationX: number
  locationY: number
  imageUrl?: string
  description?: string
  urgencyLevel?: number
  status?: string
  numVolanteer: number
  volunteerCalls: VolunteerCall[]
}
