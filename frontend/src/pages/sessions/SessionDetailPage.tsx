import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Session, Study, TimeSlot } from '../../types';
import * as sessionService from '../../services/sessionService';
import * as studyService from '../../services/studyService';
import * as timeSlotService from '../../services/timeSlotService';

export function SessionDetailPage() {
  const { studyId, sessionId } = useParams<{ studyId: string; sessionId: string }>();
  const navigate = useNavigate();
  const [study, setStudy] = useState<Study | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New slot form
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [slotCapacity, setSlotCapacity] = useState(1);
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  useEffect(() => {
    if (studyId && sessionId) {
      loadData();
    }
  }, [studyId, sessionId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [studyData, sessionData] = await Promise.all([
        studyService.getStudyById(parseInt(studyId!)),
        sessionService.getSessionById(parseInt(sessionId!)),
      ]);
      setStudy(studyData);
      setSession(sessionData);
    } catch (err) {
      setError('Failed to load session data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !slotStartTime || !slotEndTime) return;

    const sessionDate = new Date(session.date).toISOString().split('T')[0];

    try {
      setIsAddingSlot(true);
      await timeSlotService.createTimeSlot({
        sessionId: session.id,
        startTime: new Date(`${sessionDate}T${slotStartTime}`).toISOString(),
        endTime: new Date(`${sessionDate}T${slotEndTime}`).toISOString(),
        capacity: slotCapacity,
      });
      
      // Reload session to get updated slots
      const updated = await sessionService.getSessionById(session.id);
      setSession(updated);
      
      // Reset form
      setShowSlotForm(false);
      setSlotStartTime('');
      setSlotEndTime('');
      setSlotCapacity(1);
    } catch (err) {
      console.error('Failed to add time slot:', err);
    } finally {
      setIsAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await timeSlotService.deleteTimeSlot(slotId);
      const updated = await sessionService.getSessionById(parseInt(sessionId!));
      setSession(updated);
    } catch (err) {
      console.error('Failed to delete slot:', err);
    }
  };

  const handleDeleteSession = async () => {
    if (!session || !confirm('Are you sure you want to delete this session and all its time slots?')) {
      return;
    }

    try {
      await sessionService.deleteSession(session.id);
      navigate(`/studies/${studyId}`);
    } catch (err) {
      console.error('Failed to delete session:', err);
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

  if (error || !session || !study) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Session not found'}
        </div>
        <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalCapacity = session.slots?.reduce((sum, slot) => sum + slot.capacity, 0) || 0;
  const totalBookings = session.slots?.reduce((sum, slot) => sum + (slot.bookings?.length || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          </li>
          <li>/</li>
          <li>
            <Link to={`/studies/${study.id}`} className="hover:text-gray-700">{study.title}</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">
            {new Date(session.date).toLocaleDateString('fi-FI')}
          </li>
        </ol>
      </nav>

      {/* Session Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {new Date(session.date).toLocaleDateString('fi-FI', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h1>
            <p className="mt-1 text-gray-600">📍 {session.location}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span>🕐 {session.slots?.length || 0} time slots</span>
              <span>👥 {totalBookings} / {totalCapacity} booked</span>
            </div>
          </div>
          <button
            onClick={handleDeleteSession}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            Delete Session
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Time Slots</h2>
          <button
            onClick={() => setShowSlotForm(!showSlotForm)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            + Add Time Slot
          </button>
        </div>

        {/* Add Slot Form */}
        {showSlotForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <form onSubmit={handleAddSlot} className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slotStartTime}
                  onChange={(e) => setSlotStartTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={slotEndTime}
                  onChange={(e) => setSlotEndTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={slotCapacity}
                  onChange={(e) => setSlotCapacity(parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isAddingSlot}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isAddingSlot ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlotForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slots List */}
        {!session.slots || session.slots.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No time slots yet.</p>
            <p className="text-sm mt-1">Add time slots to allow participants to book.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {session.slots
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((slot) => {
                const booked = slot.bookings?.length || 0;
                const isFull = booked >= slot.capacity;

                return (
                  <li key={slot.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-4 py-2 rounded-lg text-center ${
                            isFull ? 'bg-red-100' : 'bg-green-100'
                          }`}
                        >
                          <p className={`text-lg font-semibold ${isFull ? 'text-red-700' : 'text-green-700'}`}>
                            {new Date(slot.startTime).toLocaleTimeString('fi-FI', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(slot.endTime).toLocaleTimeString('fi-FI', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Capacity: {slot.capacity} | Booked: {booked}
                          </p>
                          {isFull && (
                            <span className="text-xs font-medium text-red-600">Full</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/studies/${studyId}/sessions/${sessionId}/slots/${slot.id}`}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          View Bookings
                        </Link>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Bookings preview */}
                    {slot.bookings && slot.bookings.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">Bookings:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {slot.bookings.map((booking) => (
                            <li key={booking.id}>
                              {booking.name} {booking.email && `(${booking.email})`}
                            </li>
                          ))}
                        </ul>
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
