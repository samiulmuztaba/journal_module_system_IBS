import { useParams, Link } from "react-router";

export default function JournalDetail({ journals }) {
  const { id } = useParams();
  const journal = journals.find((j) => j.id === id);

  if (!journal) {
    return <div className="max-w-3xl mx-auto p-4">Journal not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-2 mt-6">
        {journal.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-4">{journal.title}</h1>
      <p className="text-gray-600 mb-6">By {journal.author_name}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Abstract</h2>
        <p className="text-gray-700">{journal.abstract}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Content</h2>
        <p className="text-gray-700">{journal.content}</p>
      </div>
      <Link to="/" className="mb-4 inline-block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        ← Back
      </Link>

    </div>
  );
}