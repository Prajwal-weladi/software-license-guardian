import { useAuth } from '../../contexts/AuthContext';

const EmployerLicenses = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">My Licenses</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <p className="text-center mt-40 text-gray-500">
              Your Assigned Licenses
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerLicenses; 