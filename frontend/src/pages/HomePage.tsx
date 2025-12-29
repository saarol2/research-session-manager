import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Research Session Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Hallinnoi tutkimussessioita ja varauksia
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kirjaudu
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
          >
            Rekisteröidy
          </Link>
        </div>
      </div>
    </div>
  );
}
