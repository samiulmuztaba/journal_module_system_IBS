import JournalCard from "../components/JournalCard";

export default function Section({ title, data, badgeColor }){
    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${badgeColor}`}></span>
          {title} ({data.length})
        </h3>

        {data.length === 0 ? (
          <p className="text-gray-500 text-sm">No journals here.</p>
        ) : (
          <div className="grid gap-4">
            {data.map((journal) => (
              <JournalCard key={journal.id} journal={journal} />
            ))}
          </div>
        )}
      </div>
    )
}