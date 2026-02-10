import { useState } from "react";
import ReviewerDashboard from "./components/ReviewerDashboard";

function App() {
  const mockUsers = [
    {
      id: "1e8f7a6b-5c4d-9b7c-2f6a-8f3d4e9a9c42",
      name: "Alex Chen",
      email: "alex@example.com",
      role: "admin",
    },
    {
      id: "2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
      name: "Jordan Smith",
      email: "jordan@example.com",
      role: "reviewer",
    },
    {
      id: "3f6a7b8c-9d0e-1a2b-3c4d-5e6f7a8b9c0d",
      name: "Sam Rivera",
      email: "sam@example.com",
      role: "writer",
    },
    {
      id: "4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e",
      name: "Taylor Kim",
      email: "taylor@example.com",
      role: "writer",
    },
    {
      id: "5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f",
      name: "Casey Johnson",
      email: "casey@example.com",
      role: "viewer",
    },
  ];

  const mockJournals = [
    {
      id: "9b7c2f6a-8f3d-4e9a-9c42-6d3b1a4e2f91",
      title: "Quantum Error Correction in Superconducting Qubits",
      author_id: "3f6a7b8c-9d0e-1a2b-3c4d-5e6f7a8b9c0d",
      author_name: "Sam Rivera",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. This journal explores the latest developments in quantum error correction...",
      abstract:
        "An analysis of surface code implementations in superconducting quantum processors.",
      status: "approved",
      submitted_at: "2026-01-15T10:30:00Z",
      reviewed_at: "2026-01-20T14:20:00Z",
      reviewer_id: "2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
      reviewer_name: "Jordan Smith",
      review_comment: "Excellent work. Well-researched and clearly presented.",
      tags: ["quantum computing", "physics", "error correction"],
    },
    {
      id: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
      title: "Neural Network Optimization Using Gradient Descent Variants",
      author_id: "4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e",
      author_name: "Taylor Kim",
      content:
        "Lorem ipsum dolor sit amet. Deep dive into Adam, RMSprop, and other optimization algorithms...",
      abstract:
        "Comparative study of modern gradient descent optimization techniques.",
      status: "approved",
      submitted_at: "2026-01-10T09:15:00Z",
      reviewed_at: "2026-01-18T11:45:00Z",
      reviewer_id: "1e8f7a6b-5c4d-9b7c-2f6a-8f3d4e9a9c42",
      reviewer_name: "Alex Chen",
      review_comment: "Strong analysis. Minor formatting issues corrected.",
      tags: ["machine learning", "optimization", "neural networks"],
    },
    {
      id: "8f9e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
      title: "FPGA Implementation of Real-Time Signal Processing",
      author_id: "3f6a7b8c-9d0e-1a2b-3c4d-5e6f7a8b9c0d",
      author_name: "Sam Rivera",
      content:
        "Lorem ipsum dolor sit amet. This paper discusses FPGA architectures for low-latency DSP applications...",
      abstract:
        "Hardware acceleration techniques for digital signal processing on FPGAs.",
      status: "pending",
      submitted_at: "2026-02-05T16:00:00Z",
      reviewed_at: null,
      reviewer_id: null,
      reviewer_name: null,
      review_comment: null,
      tags: ["FPGA", "signal processing", "hardware"],
    },
    {
      id: "7e6d5c4b-3a2f-1b0c-9d8e-7f6a5b4c3d2e",
      title: "Topology Optimization in Structural Engineering",
      author_id: "4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e",
      author_name: "Taylor Kim",
      content:
        "Lorem ipsum dolor sit amet. Exploring computational methods for optimizing material distribution...",
      abstract:
        "Application of topology optimization to minimize weight while maintaining structural integrity.",
      status: "rejected",
      submitted_at: "2026-01-25T13:20:00Z",
      reviewed_at: "2026-02-01T10:00:00Z",
      reviewer_id: "2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
      reviewer_name: "Jordan Smith",
      review_comment:
        "Needs more rigorous mathematical proofs. Please revise sections 3 and 4 with formal derivations.",
      tags: ["engineering", "optimization", "structural analysis"],
    },
    {
      id: "6d5c4b3a-2f1e-0d9c-8b7a-6e5f4d3c2b1a",
      title: "Riemann Hypothesis and Its Implications",
      author_id: "3f6a7b8c-9d0e-1a2b-3c4d-5e6f7a8b9c0d",
      author_name: "Sam Rivera",
      content:
        "Lorem ipsum dolor sit amet. An exploration of the Riemann zeta function...",
      abstract: "Survey of progress toward proving the Riemann Hypothesis.",
      status: "approved",
      submitted_at: "2026-01-05T08:00:00Z",
      reviewed_at: "2026-01-12T15:30:00Z",
      reviewer_id: "1e8f7a6b-5c4d-9b7c-2f6a-8f3d4e9a9c42",
      reviewer_name: "Alex Chen",
      review_comment: "Well-written overview of current research.",
      tags: ["mathematics", "number theory"],
    },
    {
      id: "5c4b3a2f-1e0d-9c8b-7a6e-5f4d3c2b1a0f",
      title: "Low-Power Circuit Design for IoT Devices",
      author_id: "4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e",
      author_name: "Taylor Kim",
      content:
        "Lorem ipsum dolor sit amet. Techniques for reducing power consumption in embedded systems...",
      abstract:
        "Analysis of ultra-low-power design methodologies for battery-operated devices.",
      status: "pending",
      submitted_at: "2026-02-08T11:30:00Z",
      reviewed_at: null,
      reviewer_id: null,
      reviewer_name: null,
      review_comment: null,
      tags: ["electronics", "IoT", "circuit design"],
    },
  ];

  // State management
  const [currentUser, setCurrentUser] = useState(mockUsers[4]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReviewerDashboard, setShowReviewerDashboard] = useState(false);

  // Filter journals based on user role
  const acceptedJournals = mockJournals.filter((j) => j.status === "approved");
  const canAddJournal = currentUser.role === "writer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User switcher for testing */}
      <div className="bg-gray-800 text-white p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Current User: </span>
              <span>{currentUser.name}</span>
              <span className="ml-2 px-2 py-1 bg-blue-600 rounded text-sm">
                {currentUser.role}
              </span>
            </div>
            <div className="flex gap-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    user.id === currentUser.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {user.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* controls */}
      {currentUser.role === "reviewer" && (
        <div>
          {!showReviewerDashboard && (
            <button onClick={() => setShowReviewerDashboard(true)}>
              Reviewer Dashboard
            </button>
          )}
        </div>
      )}

      {/* General Journal Display */}
      {showReviewerDashboard ? (
        <ReviewerDashboard journalsToRev={mockJournals.filter(journal => journal.status == "pending")}/>
      ) : selectedJournal ? (
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-2">{selectedJournal.title}</h1>
          <p className="text-gray-600 mb-4">{selectedJournal.author_name}</p>

          <div>
            <h2>Abstract</h2>
            <p>{selectedJournal.abstract}</p>
          </div>

          <div>
            <h2>Content</h2>
            <p>{selectedJournal.content}</p>
          </div>

          <button
            onClick={() => setSelectedJournal(null)}
            className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {acceptedJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white shadow-md shadow-black/10 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:bg-gray-50 transition"
                onClick={() => setSelectedJournal(journal)}
              >
                <h2 className="text-lg font-semibold mb-2">{journal.title}</h2>
                <p className="text-gray-600">{journal.author_name}</p>
              </div>
            ))}
          </div>

          {currentUser.role === "writer" && (
            <button className="bg-green-500 p-4 rounded-lg">
              Add your own journal
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
