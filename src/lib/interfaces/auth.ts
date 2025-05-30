export interface SignupForm {
  id: string;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  corpId: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  corpCode: string;
}

export interface UpdateUser {
  name: string;
  phone: string;
}
