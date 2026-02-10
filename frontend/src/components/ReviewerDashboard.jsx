export default function ReviewerDashboard({journalsToRev}) {
  return (
    <div>
        {journalsToRev.map((journal) => (
            <div key={journal.id} className="border p-4 mb-4">
                <h3 className="text-lg font-semibold">{journal.title}</h3>
                <p className="text-gray-600">{journal.author_name}</p>
                <p className="text-sm text-gray-500">
                  Submitted at:{" "}
                  {new Date(journal.submitted_at).toLocaleString()}
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Review
                </button>
              </div>
        ))}
    </div>
  );
}
