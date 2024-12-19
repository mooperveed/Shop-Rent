import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import ShopListPage from "./components/page/shopListPage";
import { ShopDetailPage } from "./components/page/shopDetailPage";
import LoginPage from "./components/page/loginPage";
import { auth } from './libs/db';
import { onAuthStateChanged } from 'firebase/auth';

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif"
  }
});

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route 
            path="/" 
            element={user ? <ShopListPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/shop/:shopId" 
            element={user ? <ShopDetailPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

