import { useState, useEffect } from "react";
import { auth, signInAnonymously, onAuthStateChanged } from "../config/firebase";
import type { User } from "firebase/auth";

interface AuthState {
  user:    User | null;
  loading: boolean;
  error:   string | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user:    null,
    loading: true,
    error:   null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setState({ user, loading: false, error: null });
      } else {
        signInAnonymously(auth)
          .then(({ user }) => setState({ user, loading: false, error: null }))
          .catch((err: Error) => setState({ user: null, loading: false, error: err.message }));
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}