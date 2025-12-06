// src/api/auth.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginResponse {
  accessToken: string;
  user: {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: number;
  };
}

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const registerApi = async (payload: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: number;
}): Promise<LoginResponse> => {
  const res = await api.post('/auth/register', payload);
  return res.data;
};
