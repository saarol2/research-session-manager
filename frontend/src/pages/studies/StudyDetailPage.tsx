import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Study } from '../../types';
import * as studyService from '../../services/studyService';

export function StudyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [study, setStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadStudy(parseInt(id));
    }
  }, [id]);

  const loadStudy = async (studyId: number) => {
    try {
      setIsLoading(true);
      const data = await studyService.getStudyById(studyId);
      setStudy(data);
    } catch (err) {
      setError('Failed to load study');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!study || !confirm('Are you sure you want to delete this study? This action cannot be undone.')) {
      return;
    }

    try {
      await studyService.deleteStudy(study.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete study:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Study not found'}
        </div>
        <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalSessions = study.sessions?.length || 0;
  const totalSlots = study.sessions?.reduce((sum, s) => sum + (s.slots?.length || 0), 0) || 0;
  const totalBookings = study.sessions?.reduce((sum, s) => 
    sum + (s.slots?.reduce((slotSum, slot) => slotSum + (slot.bookings?.length || 0), 0) || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{study.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{study.title}</h1>
            {study.description && (
              <p className="mt-2 text-gray-600">{study.description}</p>
            )}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
              <span>📅 {totalSessions} session{totalSessions !== 1 ? 's' : ''}</span>
              <span>🕐 {totalSlots} time slot{totalSlots !== 1 ? 's' : ''}</span>
              <span>👥 {totalBookings} booking{totalBookings !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/studies/${study.id}/edit`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
          <Link
            to={`/studies/${study.id}/sessions/new`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            + Add Session
          </Link>
        </div>

        {!study.sessions || study.sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No sessions yet.</p>
            <p className="text-sm mt-1">Create your first session to start collecting bookings.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {study.sessions.map((session) => {
              const sessionSlots = session.slots?.length || 0;
              const sessionBookings = session.slots?.reduce((sum, slot) => sum + (slot.bookings?.length || 0), 0) || 0;
              const totalCapacity = session.slots?.reduce((sum, slot) => sum + slot.capacity, 0) || 0;
              const isFull = sessionBookings >= totalCapacity && totalCapacity > 0;

              return (
                <li key={session.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString('fi-FI', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </h3>
                        {isFull && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Full
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">📍 {session.location}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>🕐 {sessionSlots} slot{sessionSlots !== 1 ? 's' : ''}</span>
                        <span>👥 {sessionBookings} / {totalCapacity} booked</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/studies/${study.id}/sessions/${session.id}`}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        Manage Slots
                      </Link>
                    </div>
                  </div>

                  {/* Time slots preview */}
                  {session.slots && session.slots.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {session.slots.map((slot) => {
                        const booked = slot.bookings?.length || 0;
                        const isFull = booked >= slot.capacity;
                        
                        return (
                          <div
                            key={slot.id}
                            className={`px-3 py-1 text-sm rounded-full ${
                              isFull
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {new Date(slot.startTime).toLocaleTimeString('fi-FI', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(slot.endTime).toLocaleTimeString('fi-FI', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            <span className="ml-1 opacity-75">
                              ({booked}/{slot.capacity})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
