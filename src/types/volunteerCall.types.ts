import type { Call } from './call.types';

export interface VolunteerCall {
  callsId: number;
  volunteerId: number;
  volunteerStatus: string;
  responseTime: string;
  call: Call;
  goingVolunteersCount: number;
}
