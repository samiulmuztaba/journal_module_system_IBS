import { Link } from "react-router"

export default function JournalCard({ journal }) {
  const statusColors = {
    approved: "bg-green-500",
    pending: "bg-yellow-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition">
      <Link to={`/journal/${journal.id}`}>
        <h4 className="font-semibold text-gray-800 mb-2">{journal.title}</h4>
      </Link>
      <p className="text-sm text-gray-500 mb-3">
        Submitted {new Date(journal.submitted_at).toLocaleDateString()}
      </p>

      {/* Review Information */}
      {journal.reviewed_at && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${statusColors[journal.status]}`}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              Reviewed by {journal.reviewer_name}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {new Date(journal.reviewed_at).toLocaleString()}
          </p>
          {journal.review_comment && (
            <div className="bg-white border border-gray-200 rounded p-2 mt-2">
              <p className="text-sm text-gray-700 italic">
                "{journal.review_comment}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          to={`/journal/${journal.id}`}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
        >
          View
        </Link>
        {journal.status === "rejected" && (
          <Link
            to={`/edit-journal/${journal.id}`}
            className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
          >
            Edit & Resubmit
          </Link>
        )}
      </div>
    </div>
  );
}
