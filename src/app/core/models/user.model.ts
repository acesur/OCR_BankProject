export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  department?: string;
  station?: string;
  bank?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  POLICE = 'POLICE',
  ADMIN = 'ADMIN',
  BANK = 'BANK'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}