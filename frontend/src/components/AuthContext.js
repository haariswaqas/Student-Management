// authContext.js
import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token); // Store token in local storage
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token'); // Remove token from local storage
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token'); // Get token from local storage
  const initialState = tokenFromStorage
    ? { isAuthenticated: true, token: tokenFromStorage }
    : { isAuthenticated: false, token: null };

  const [authState, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
