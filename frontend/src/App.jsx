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
import AuthorDashboard from "./pages/AuthorDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [allJournals, setAlljournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (currentUser) console.log(currentUser.role)

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const approvedJournals = await api.getJournals("approved");
        const allData = await api.getJournals();
        setAlljournals(allData);
        setJournals(approvedJournals);
        console.log(approvedJournals);
        setLoadingJournals(false);
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
            element={
              <Home journals={journals} loadingJournals={loadingJournals} />
            }
          />
          <Route
            path="/login"
            element={
              !currentUser ? (
                <Login onLogin={setCurrentUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !currentUser ? (
                <Register onRegister={setCurrentUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/journal/:id"
            element={<JournalDetail journals={journals} />}
          />
          <Route
            path="/reviewer-dashboard"
            element={
              !currentUser || currentUser.role !== "reviewer" ? (
                <Navigate to="/" replace />
              ) : (
                <ReviewerDashboard journals={allJournals} />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              !currentUser || currentUser.role !== "admin" ? (
                <Navigate to="/" replace />
              ) : (
                <Admindashboard journals={allJournals} />
              )
            }
          />
          <Route
            path="/create-journal"
            element={
              !currentUser || currentUser.role !== "writer" ? (
                <Navigate to="/" replace />
              ) : (
                <CreateJournal />
              )
            }
          />
          <Route
            path="/author-dashboard/:author_id"
            element={<AuthorDashboard />}
          />
          <Route
            path="/review/:id"
            element={
              (currentUser &&
              (currentUser.role == "reviewer" ||
                currentUser.role == "admin")) ? (
                <ReviewJournal journals={allJournals} currentUser={currentUser} />
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
