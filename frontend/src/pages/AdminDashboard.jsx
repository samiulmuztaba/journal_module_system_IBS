export default function Admindashboard({ journals }) {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      {journals.map((journal) => (
        <div>
          <h2>{journal.title}</h2>
          <p>{journal.abstract}</p>
          <div>
            <button>update</button>
            <button>delete</button>
          </div>
        </div>
      ))}
      <button>+ Add</button>
    </div>
  );
}
