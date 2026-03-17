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
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState({ user, loading: false, error: null });
      } else {
        // No user — sign in anonymously
        signInAnonymously(auth)
          .then(({ user }) => setState({ user, loading: false, error: null }))
          .catch((err)    => setState({ user: null, loading: false, error: err.message }));
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}