import { Link } from "react-router";

export default function Admindashboard({ journals }) {
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this journal?")) {
      console.log("Deleting journal:", id);
      alert("Journal deleted!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/create">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Add Journal
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {journals.map((journal) => (
          <div key={journal.id} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{journal.title}</h2>
              <p className="text-gray-600 mb-2">{journal.author_name}</p>
              <p className="text-gray-700 mb-3">{journal.abstract}</p>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                journal.status === "approved" 
                  ? "bg-green-100 text-green-800" 
                  : journal.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {journal.status}
              </span>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Link to={`/journal/${journal.id}`}>
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View
                </button>
              </Link>
              {journal.status === "pending" && (
                <Link to={`/review/${journal.id}`}>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600">
                    Review
                  </button>
                </Link>
              )}
              <button
                onClick={() => handleDelete(journal.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}