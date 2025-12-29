import { Button } from '../components/common';

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Research Session Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Manage and organize your research sessions with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Button as="link" to="/login" size="lg">
            Login
          </Button>
          <Button as="link" to="/register" variant="secondary" size="lg">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
