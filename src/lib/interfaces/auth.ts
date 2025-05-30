export interface SignupForm {
  id: string;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  corpId: string;
}

export interface LoginForm {
  id: string;
  password: string;
}
export interface TokenData {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  corpId: string;
}

export interface UpdateUser {
  name: string;
  phone: string;
}
