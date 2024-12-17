export interface DataStateModel {
  users: User[];
  isAuthenticated: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  isOnline: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}
