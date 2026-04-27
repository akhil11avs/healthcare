import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, setUser, setAuthLoading, setAuthError } from '../app/store';
import { auth } from '../services/firebase';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, authLoading, authError } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      dispatch(setUser(firebaseUser));
      dispatch(setAuthLoading(false));
    });
    return unsubscribe;
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    dispatch(setAuthError(null));
    dispatch(setAuthLoading(true));
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      dispatch(setUser(user));
      return user;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? 'unknown';
      const message = (err as { message?: string }).message ?? 'Login failed.';
      dispatch(setAuthError(message));
      dispatch(setAuthLoading(false));
      throw { code, message };
    }
  };

  const signOut = async () => {
    await auth.signOut();
    dispatch(setUser(null));
  };

  return { user, isAuthenticated, authLoading, authError, signIn, signOut };
}
