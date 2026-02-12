import { useParams } from "react-router";
import { Link } from "react-router";
import Section from "../components/Section";

export default function AuthorDashboard({ journals, currentUser }) {
  const { author_id } = useParams();

  const author_journals = journals.filter(
    (journal) => journal.author_id == author_id
  );

  const published = author_journals.filter(
    (journal) => journal.status === "approved"
  );

  const pending = author_journals.filter(
    (journal) => journal.status === "pending"
  );

  const rejected = author_journals.filter(
    (journal) => journal.status === "rejected"
  );



  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {currentUser.name}
        </h2>

        <Link
          to="/create-journal"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition shadow"
        >
          + Create Journal
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section
          title="Published"
          data={published}
          badgeColor="bg-green-500"
        />
        <Section
          title="Pending Review"
          data={pending}
          badgeColor="bg-yellow-500"
        />
        <Section
          title="Rejected"
          data={rejected}
          badgeColor="bg-red-500"
        />
      </div>
    </div>
  );
}