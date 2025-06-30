import axios from "axios";

const API_BASE = "https://localhost:7219/api";

export const registerVolunteer = (volunteer: any) => {
  return axios.post(`${API_BASE}/Volunteer`, volunteer);
};

export const checkVolunteerExists = (gmail: string) => {
  return axios.get(`${API_BASE}/Volunteer/exists`, {
    params: { gmail }
  });
};


export const getVolunteers = () => {
  return axios.get(`${API_BASE}/Volunteer`);
};

export const getVolunteerById = (id: number) => {
  return axios.get(`${API_BASE}/Volunteer/${id}`);
};

export const updateVolunteer = (id: number, updatedData: any) => {
  return axios.put(`${API_BASE}/Volunteer/${id}`, updatedData);
};

export const deleteVolunteer = (id: number) => {
  return axios.delete(`${API_BASE}/Volunteer/${id}`);
};

export const getNearbyCalls = (volunteerId: number) => {
  return axios.get(`${API_BASE}/Volunteer/nearby-alerts`, {
    params: { id: volunteerId }
  });
};
