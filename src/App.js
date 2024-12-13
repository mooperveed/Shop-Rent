import ShopListPage from "./components/page/shopListPage";
import { ShopDetailPage } from "./components/page/shopDetailPage";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif"
  }
});
const queryClient = new QueryClient();
function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<ShopListPage />} />
          <Route path="/shop/:shopId" element={<ShopDetailPage />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
