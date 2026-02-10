import { Link } from "react-router";

export default function Navbar({ currentUser, mockUsers, setCurrentUser }) {
  return (
    <div className="bg-gray-800 text-white p-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-2xl font-bold">IBS Journal</Link>
          
          <div className="flex gap-4">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            {(currentUser.role === "reviewer" || currentUser.role === "admin") && (
              <Link to="/reviewer-dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>
            )}
            {currentUser.role === "writer" && (
              <Link to="/create" className="hover:text-blue-400">
                Create Journal
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold">Current User: </span>
            <span>{currentUser.name}</span>
            <span className="ml-2 px-2 py-1 bg-blue-600 rounded text-sm">
              {currentUser.role}
            </span>
          </div>
          <div className="flex gap-2">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={`px-3 py-1 rounded text-sm transition ${
                  user.id === currentUser.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {user.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}