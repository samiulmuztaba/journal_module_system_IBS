import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../api/client";

export default function EditJournal({ currentUser }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    tags: [],
  });
  const [originalJournal, setOriginalJournal] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const journal = await api.getJournal(id);
        
        // Check if user is authorized
        if (journal.author_id !== currentUser.id && currentUser.role !== 'admin') {
          alert("You are not authorized to edit this journal");
          navigate("/");
          return;
        }

        setOriginalJournal(journal);
        setFormData({
          title: journal.title,
          abstract: journal.abstract,
          content: journal.content,
          tags: journal.tags,
        });
      } catch (err) {
        alert(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateJournal(id, formData, currentUser.id);
      alert("Journal updated and resubmitted for review!");
      navigate(`/author-dashboard/${currentUser.id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p>Loading journal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Edit & Resubmit Journal</h1>
      
      {originalJournal?.status === "rejected" && originalJournal?.review_comment && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">
            Reviewer Feedback ({originalJournal.reviewer_name})
          </h3>
          <p className="text-red-700 italic">"{originalJournal.review_comment}"</p>
          <p className="text-sm text-red-600 mt-2">
            Please address the feedback above before resubmitting.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter journal title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Abstract
          </label>
          <textarea
            required
            rows="4"
            value={formData.abstract}
            onChange={(e) =>
              setFormData({ ...formData, abstract: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your journal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            required
            rows="10"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full journal content"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: [e.target.value] })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., physics, quantum computing, engineering"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg"
          >
            Update & Resubmit for Review
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}