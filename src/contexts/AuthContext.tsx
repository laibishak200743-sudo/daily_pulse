import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { User } from 'firebase/auth';

import {
  getAuthErrorMessage,
  loginUser,
  logoutUser,
  refreshEmailVerification,
  registerUser,
  sendVerificationEmail,
  subscribeToAuth,
  updateUserDisplayName,
} from '../services/authService';

const GUEST_MODE_KEY = 'DAILY_PULSE_GUEST_MODE';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<User>;

  continueAsGuest: () => void;

  logout: () => Promise<void>;

  sendVerificationEmail: () => Promise<void>;

  refreshVerification: () => Promise<boolean>;

  updateDisplayName: (
    displayName: string
  ) => Promise<void>;

  getErrorMessage: (error: unknown) => string;

  // Compatibility aliases
  signIn: (
    email: string,
    password: string
  ) => Promise<User>;

  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<User>;

  resendEmailVerification: () => Promise<void>;

  refreshEmailVerification: () => Promise<boolean>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isGuest, setIsGuest] =
    useState(false);

  // --------------------------------------------------
  // RESTORE GUEST MODE
  // --------------------------------------------------

  useEffect(() => {
    const guestMode =
      localStorage.getItem(
        GUEST_MODE_KEY
      ) === 'true';

    setIsGuest(guestMode);
  }, []);

  // --------------------------------------------------
  // FIREBASE AUTH STATE
  // --------------------------------------------------

  useEffect(() => {
    const unsubscribe =
      subscribeToAuth((currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          // A real Firebase account always
          // takes priority over guest mode.
          localStorage.removeItem(
            GUEST_MODE_KEY
          );

          setIsGuest(false);
        }

        setLoading(false);
      });

    return unsubscribe;
  }, []);

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    const loggedInUser =
      await loginUser(
        email,
        password
      );

    localStorage.removeItem(
      GUEST_MODE_KEY
    );

    setIsGuest(false);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<User> => {
    const newUser =
      await registerUser(
        email,
        password,
        displayName
      );

    localStorage.removeItem(
      GUEST_MODE_KEY
    );

    setIsGuest(false);
    setUser(newUser);

    return newUser;
  };

  // --------------------------------------------------
  // GUEST MODE
  // --------------------------------------------------

  const continueAsGuest = () => {
    localStorage.setItem(
      GUEST_MODE_KEY,
      'true'
    );

    setUser(null);
    setIsGuest(true);
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = async () => {
    await logoutUser();

    localStorage.removeItem(
      GUEST_MODE_KEY
    );

    setUser(null);
    setIsGuest(false);
  };

  // --------------------------------------------------
  // EMAIL VERIFICATION
  // --------------------------------------------------

  const handleSendVerificationEmail =
    async () => {
      await sendVerificationEmail();
    };

  const handleRefreshVerification =
    async (): Promise<boolean> => {
      const verified =
        await refreshEmailVerification();

      if (verified) {
        const currentUser =
          authUser();

        if (currentUser) {
          setUser({
            ...currentUser,
          });
        }
      }

      return verified;
    };

  // --------------------------------------------------
  // UPDATE DISPLAY NAME
  // --------------------------------------------------

  const handleUpdateDisplayName =
    async (
      displayName: string
    ): Promise<void> => {
      const updatedUser =
        await updateUserDisplayName(
          displayName
        );

      setUser({
        ...updatedUser,
      });
    };

  // --------------------------------------------------
  // CURRENT USER HELPER
  // --------------------------------------------------

  const authUser = (): User | null => {
    return user;
  };

  // --------------------------------------------------
  // AUTH STATE
  // --------------------------------------------------

  const isAuthenticated =
    !!user &&
    user.emailVerified;

  // --------------------------------------------------
  // CONTEXT
  // --------------------------------------------------

  const value: AuthContextValue = {
    user,
    loading,
    isGuest,
    isAuthenticated,

    login,
    register,
    continueAsGuest,
    logout,

    sendVerificationEmail:
      handleSendVerificationEmail,

    refreshVerification:
      handleRefreshVerification,

    updateDisplayName:
      handleUpdateDisplayName,

    getErrorMessage:
      getAuthErrorMessage,

    // Compatibility aliases
    signIn: login,
    signUp: register,

    resendEmailVerification:
      handleSendVerificationEmail,

    refreshEmailVerification:
      handleRefreshVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}