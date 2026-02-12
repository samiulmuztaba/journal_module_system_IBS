import { Link } from "react-router";

export default function Home({ journals }) {

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journals.map((journal) => (
          <Link
            key={journal.id}
            to={`/journal/${journal.id}`}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-lg font-semibold mb-2">{journal.title}</h2>
            <p className="text-gray-600">{journal.author_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}