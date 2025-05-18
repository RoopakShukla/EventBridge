export interface SignUpData {
  username: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}