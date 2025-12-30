import { Link } from 'react-router-dom';
import { Study } from '../../types';

interface StudyListProps {
  studies: Study[];
  onDelete: (id: number) => void;
}

export function StudyList({ studies, onDelete }: StudyListProps) {
  if (studies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 mb-4">You don't have any studies yet.</p>
        <Link
          to="/studies/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Your First Study
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {studies.map((study) => {
          const sessionCount = study.sessions?.length || 0;
          const bookingCount = study.sessions?.reduce((total, session) => {
            return total + (session.slots?.reduce((slotTotal, slot) => {
              return slotTotal + (slot.bookings?.length || 0);
            }, 0) || 0);
          }, 0) || 0;

          return (
            <li key={study.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {study.title}
                  </h3>
                  {study.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {study.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {sessionCount} session{sessionCount !== 1 ? 's' : ''}</span>
                    <span>👥 {bookingCount} booking{bookingCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Link
                    to={`/studies/${study.id}`}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    View
                  </Link>
                  <Link
                    to={`/studies/${study.id}/edit`}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(study.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
