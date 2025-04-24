export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
}

export interface SignInFormValues {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export enum AuthActionType {
  AUTH_START = 'AUTH_START',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  LOGOUT = 'LOGOUT',
}

export type AuthAction =
  | { type: AuthActionType.AUTH_START }
  | { type: AuthActionType.AUTH_SUCCESS; payload: { user: User; token: string } }
  | { type: AuthActionType.AUTH_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT };