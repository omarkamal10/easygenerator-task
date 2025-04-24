import { useAuth } from '../context/AuthContext';

const AppPage: React.FC = () => {
  const { state, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to the application
          </h2>
          {state.user && (
            <p className="mt-2 text-lg text-gray-600">
              Hello, {state.user.name}!
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={signOut}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPage;