import { Link } from "react-router";

export default function ReviewerDashboard({ journals }) {
  const pendingJournals = journals.filter((j) => j.status === "pending");

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reviewer Dashboard</h1>

      {pendingJournals.length === 0 ? (
        <p className="text-gray-600">No journals pending review.</p>
      ) : (
        <div className="space-y-4">
          {pendingJournals.map((journal) => (
            <div key={journal.id} className="border rounded-lg p-4 bg-white">
              <h3 className="text-xl font-semibold">{journal.title}</h3>
              <p className="text-gray-600">{journal.author_name}</p>
              <p className="text-sm text-gray-500 mb-3">
                Submitted: {new Date(journal.submitted_at).toLocaleString()}
              </p>
              <Link to={`/review/${journal.id}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Review
              </button></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}