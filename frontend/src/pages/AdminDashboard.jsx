import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function AdminDashboard({ journals, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("journals"); // journals or users
  const [selectedRole, setSelectedRole] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await api.getUsers();
        setUsers(userData);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteJournal = async (id) => {
    if (confirm("Are you sure you want to delete this journal?")) {
      try {
        await api.deleteJournal(id, currentUser.id);
        alert("Journal deleted!");
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(userId);
        alert("User deleted!");
        setUsers(users.filter((u) => u.id !== userId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleRoleChange = async (userId) => {
    const newRole = selectedRole[userId];
    if (!newRole) {
      alert("Please select a role");
      return;
    }
    try {
      await api.updateUserRole(userId, newRole);
      alert("Role updated successfully!");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Statistics
  const stats = {
    totalJournals: journals.length,
    pending: journals.filter((j) => j.status === "pending").length,
    approved: journals.filter((j) => j.status === "approved").length,
    rejected: journals.filter((j) => j.status === "rejected").length,
    totalUsers: users.length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Journals</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalJournals}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Total Users</p>
          <p className="text-2xl font-bold text-purple-900">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("journals")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "journals"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Journals
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "users"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          User Management
        </button>
      </div>

      {/* Journals Tab */}
      {activeTab === "journals" && (
        <div className="space-y-4">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white border rounded-lg p-4 flex justify-between items-start hover:shadow-md transition"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{journal.title}</h2>
                <p className="text-gray-600 mb-2">
                  By {journal.author_name} • Submitted{" "}
                  {new Date(journal.submitted_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {journal.abstract}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      journal.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : journal.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {journal.status}
                  </span>
                  {journal.reviewer_name && (
                    <span className="text-sm text-gray-500">
                      Reviewed by {journal.reviewer_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link to={`/journal/${journal.id}`}>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    View
                  </button>
                </Link>
                {journal.status === "pending" && (
                  <Link to={`/review/${journal.id}`}>
                    <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                      Review
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => handleDeleteJournal(journal.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedRole[user.id] || user.role}
                    onChange={(e) =>
                      setSelectedRole({ ...selectedRole, [user.id]: e.target.value })
                    }
                    className="px-3 py-1 border border-gray-300 rounded"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="writer">Writer</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRoleChange(user.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Update Role
                  </button>
                  {user.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}