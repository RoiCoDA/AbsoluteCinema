import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import Provider

import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import BookingPage from "./pages/BookingPage";
import RoomPage from "./pages/RoomPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movieId" element={<MoviePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
