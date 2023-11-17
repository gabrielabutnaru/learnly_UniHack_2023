import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from 'react';
import axios from 'axios';

export const AuthContext = createContext<{
  actions: { signIn: (jwt: string) => void; signOut: () => void };
  isLoggedIn: boolean;
} | null>(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signIn = useCallback((jwt: string) => {
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    });
    setIsLoggedIn(true);
  }, []);

  const signOut = useCallback(() => {
    axios.interceptors.request.clear();
    setIsLoggedIn(false);
  }, []);

  const authContextValue = useMemo(
    () => ({
      actions: { signIn, signOut },
      isLoggedIn,
    }),
    [isLoggedIn]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
