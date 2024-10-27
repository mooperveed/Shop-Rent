import RoomListPage from "./components/page/roomListPage";
import { RoomDetailPage } from "./components/page/roomDetailPage";
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
          <Route path="/" element={<RoomListPage />} />
          <Route path="/room/:roomId" element={<RoomDetailPage />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
