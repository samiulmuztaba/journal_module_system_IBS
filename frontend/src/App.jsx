import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import JournalDetail from "./pages/JournalDetail";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import CreateJournal from "./pages/CreateJournal";
import Admindashboard from "./pages/AdminDashboard";
import ReviewJournal from "./pages/ReviewJournal";
import { api } from "./api/client";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true)

  const handleLogout = () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await api.getJournals("approved");
        setJournals(data);
        console.log(data);
        setLoadingJournals(false)
      } catch (err) {
        alert(err.message);
      }
    };
    fetchJournals();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen mb-15">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <Routes>
          <Route
            path="/"
            element={<Home journals={[]} loadingJournals={loadingJournals} />}
          />
          <Route path="/login" element={!currentUser ? <Login onLogin={setCurrentUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!currentUser ? <Register onRegister={setCurrentUser}/> : <Navigate to="/" />}/>
          <Route
            path="/journal/:id"
            element={<JournalDetail journals={journals} />}
          />
          <Route
            path="/reviewer-dashboard"
            element={
              !currentUser || currentUser.role === "reviewer" ? (
                <ReviewerDashboard journals={journals} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              !currentUser || currentUser.role == "admin" ? (
                <Admindashboard journals={journals} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-journal"
            element={
              !currentUser || currentUser.role === "writer" ? (
                <CreateJournal />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/review/:id"
            element={
              !currentUser ||
              currentUser.role == "reviewer" ||
              currentUser.role == "admin" ? (
                <ReviewJournal journals={journals} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
