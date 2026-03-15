import { createContext, useEffect, useContext, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utilis/Firebase";

// Create the context
export const AuthContext = createContext();

// Create the provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

   const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    logout
  };

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

