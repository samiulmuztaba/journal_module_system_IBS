import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import { api } from "../api/client";

export default function ReviewJournal({ journals, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const journal = journals.find((j) => j.id === id);
  
  const [reviewComment, setReviewComment] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      journalId: id,
      comment: reviewComment,
      approved: isApproved,
      reviewed_by: currentUser.id,
    });
    alert(`Journal ${isApproved ? "approved" : "rejected"}!`);
    try {
      const reviewSubmission = await api.submitReview(id, {"review_comment": reviewComment,
  "approved": isApproved}, currentUser.id)
      console.log(reviewSubmission)
    } catch(err) {alert(err.message)}
    navigate("/reviewer-dashboard");
  };

  if (!journal) {
    return <div className="max-w-3xl mx-auto p-4">Journal not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/reviewer-dashboard" className="mb-4 inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{journal.title}</h2>
        <p className="text-gray-600 mb-4">By {journal.author_name}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Abstract</h3>
          <p className="text-gray-700">{journal.abstract}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Content</h3>
          <p className="text-gray-700">{journal.content}</p>
        </div>

        <div className="flex gap-2">
          {journal.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Submit Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Comment
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Provide feedback on this journal..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="approve"
              checked={isApproved}
              onChange={(e) => setIsApproved(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="approve" className="text-sm font-medium">
              Approve this journal
            </label>
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 rounded-lg font-medium ${
              isApproved
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {isApproved ? "Approve Journal" : "Reject Journal"}
          </button>
        </form>
      </div>
    </div>
  );
}