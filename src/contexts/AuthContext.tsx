import React, { useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthContextState {
  user: any | null;
}

export const AuthContext = React.createContext({} as IAuthContextState);

export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const register = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      return userCredential.user;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const logOut = () => {
  return auth.signOut();
};

export const currentUserId = (): string => {
  return auth.currentUser?.uid ?? '';
};

export const AuthProvider: React.FunctionComponent<IAuthContextProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
