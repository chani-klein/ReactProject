// src/types/user.types.ts

export enum RoleType {
  User = "User",
  Volunteer = "Volunteer",
  Admin = "Admin" // אם יש
}

export interface PersonDto {
  id: number;
  name: string;
  gmail: string;
  phoneNumber: string;
  address: string;
  role: RoleType;
}
