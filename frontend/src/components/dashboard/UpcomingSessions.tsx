import { Session } from '../../types';

interface UpcomingSessionsProps {
  sessions: Session[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No upcoming sessions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {sessions.map((session) => {
          const totalCapacity = session.slots?.reduce((sum, slot) => sum + slot.capacity, 0) || 0;
          const bookedCount = session.slots?.reduce((sum, slot) => sum + (slot.bookings?.length || 0), 0) || 0;
          const isFull = bookedCount >= totalCapacity && totalCapacity > 0;
          const isAlmostFull = bookedCount >= totalCapacity * 0.8 && !isFull;

          return (
            <li key={session.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(session.date).toLocaleDateString('fi-FI', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{session.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      isFull
                        ? 'bg-red-100 text-red-700'
                        : isAlmostFull
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {bookedCount} / {totalCapacity}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
