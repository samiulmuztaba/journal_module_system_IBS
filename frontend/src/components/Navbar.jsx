import { Link } from "react-router";

export default function Navbar({ currentUser, onLogout }) {
  return (
    <div className="bg-gray-800 text-white p-4 mb-6 font-bold flex justify-between">
      <Link to="/">
        <h2>IBS Journal</h2>
      </Link>
      <div className="flex flex-row gap-4">
        <Link to="/">
          <p>Home</p>
        </Link>
        {!currentUser ? (
          <div className="flex flex-row gap-4">
          <Link to="/login">
            <p>Login</p>
          </Link>
          
          <Link to="/register">
            <p>Register</p>
          </Link>
          </div>
        ) : (
          <div className="flex flex-row gap-4">
            <p>{currentUser.name}</p>
            <button onClick={onLogout}>Logout</button>
            {currentUser.role == 'admin' && <Link to="/admin-dashboard"><p>Admin Dashboard</p></Link>}
            {currentUser.role == 'reviewer' && <Link to="/reviewer-dashboard"><p>Reviewer Dashboard</p></Link>}
            {console.log(currentUser.role == 'writer')}
            {currentUser.role == 'writer' && <Link to={`/author-dashboard/`}><p>Author Dashboard</p></Link>}
          </div>
        )}
        
      </div>
    </div>
  );
}
