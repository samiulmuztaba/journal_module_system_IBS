import { useParams } from "react-router";
export default function ReviewJournal({ journals }) {
  const journal = journals.filter((journal) => journal.id == useParams);
  return (
    <div>
      <div>
        <h2>{journal.title}</h2>
        <p>{journal.abstract}</p>
        <p>{journal.content}</p>
      </div>
      <div>
        <form action="">
          <input type="text" />
          <input type="checkbox" name="Accept" id="" />
          <button>Submit Review</button>
        </form>
      </div>
    </div>
  );
}
