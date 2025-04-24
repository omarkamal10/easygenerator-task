/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, SignInFormValues, SignUpFormValues, User } from '../types/auth.types';
import { authService } from '../services/api.service';

enum AuthActionType {
  AUTH_START = 'AUTH_START',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  LOGOUT = 'LOGOUT',
}

type AuthAction =
  | { type: AuthActionType.AUTH_START }
  | { type: AuthActionType.AUTH_SUCCESS; payload: { user: User; token: string } }
  | { type: AuthActionType.AUTH_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

interface AuthContextProps {
  state: AuthState;
  signUp: (userData: SignUpFormValues) => Promise<void>;
  signIn: (credentials: SignInFormValues) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActionType.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AuthActionType.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case AuthActionType.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          dispatch({ type: AuthActionType.AUTH_START });
          const response = await authService.getProfile();
          dispatch({
            type: AuthActionType.AUTH_SUCCESS,
            payload: {
              user: response.user,
              token: state.token as string,
            },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({
            type: AuthActionType.AUTH_FAILURE,
            payload: 'Authentication failed. Please log in again.',
          });
        }
      }
    };

    loadUser();
  }, [state.token]);

  const signUp = async (userData: SignUpFormValues) => {
    try {
      dispatch({ type: AuthActionType.AUTH_START });
      const response = await authService.signUp(userData);
      dispatch({
        type: AuthActionType.AUTH_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error: any) {
      dispatch({
        type: AuthActionType.AUTH_FAILURE,
        payload: error.message || 'Sign up failed. Please try again.',
      });
      throw error;
    }
  };

  const signIn = async (credentials: SignInFormValues) => {
    try {
      dispatch({ type: AuthActionType.AUTH_START });
      const response = await authService.signIn(credentials);
      dispatch({
        type: AuthActionType.AUTH_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error: any) {
      dispatch({
        type: AuthActionType.AUTH_FAILURE,
        payload: error.message || 'Sign in failed. Please try again.',
      });
      throw error;
    }
  };

  const signOut = () => {
    authService.signOut();
    dispatch({ type: AuthActionType.LOGOUT });
  };


  const clearError = () => {
    dispatch({ type: AuthActionType.AUTH_FAILURE, payload: '' });
  };

  return (
    <AuthContext.Provider value={{ state, signUp, signIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};