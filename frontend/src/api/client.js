const API_BASE_URL = "http://localhost:8000";

// ============ User Endpoints ============
export const api = {
  // Get all users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  // Create new user
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create user");
    }
    return response.json();
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }
    return response.json();
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    const response = await fetch(
      `${API_BASE_URL}/api/users/${userId}?new_role=${newRole}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to update user role");
    return response.json();
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },

  // ============ Journal Endpoints ============
  // Get all journals (with optional status filter)
  getJournals: async (status = null) => {
    const url = status
      ? `${API_BASE_URL}/api/journals?status=${status}`
      : `${API_BASE_URL}/api/journals`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch journals");
    return response.json();
  },

  // Get journal by ID
  getJournal: async (journalId) => {
    const response = await fetch(`${API_BASE_URL}/api/journals/${journalId}`);
    if (!response.ok) throw new Error("Failed to fetch journal");
    return response.json();
  },

  // Create new journal
  createJournal: async (journalData, authorId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/journals?author_id=${authorId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journalData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create journal");
    }
    return response.json();
  },

  // Delete journal
  deleteJournal: async (journalId, userId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/journals/${journalId}?user_id=${userId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete journal");
  },

  // Submit review
  submitReview: async (journalId, reviewData, reviewerId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/journals/${journalId}/review?reviewer_id=${reviewerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to submit review");
    }
    return response.json();
  },
};