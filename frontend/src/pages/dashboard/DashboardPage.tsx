import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatsCard, StudyList, UpcomingSessions } from '../../components/dashboard';
import { Study, Session } from '../../types';
import * as studyService from '../../services/studyService';

export function DashboardPage() {
  const { user } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    try {
      setIsLoading(true);
      const data = await studyService.getMyStudies();
      setStudies(data);
    } catch (err) {
      setError('Failed to load studies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudy = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study?')) return;
    
    try {
      await studyService.deleteStudy(id);
      setStudies(studies.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete study:', err);
    }
  };

  // Calculate stats
  const totalSessions = studies.reduce((sum, study) => sum + (study.sessions?.length || 0), 0);
  const totalBookings = studies.reduce((sum, study) => {
    return sum + (study.sessions?.reduce((sessionSum, session) => {
      return sessionSum + (session.slots?.reduce((slotSum, slot) => {
        return slotSum + (slot.bookings?.length || 0);
      }, 0) || 0);
    }, 0) || 0);
  }, 0);

  // Get upcoming sessions (next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingSessions: Session[] = studies
    .flatMap(study => study.sessions || [])
    .filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= now && sessionDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's an overview of your research studies.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Studies"
          value={studies.length}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Sessions"
          value={totalSessions}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Upcoming (7 days)"
          value={upcomingSessions.length}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Studies List (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Studies</h2>
            <Link
              to="/studies/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              + New Study
            </Link>
          </div>
          <StudyList studies={studies} onDelete={handleDeleteStudy} />
        </div>

        {/* Upcoming Sessions (1/3 width) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <UpcomingSessions sessions={upcomingSessions} />
        </div>
      </div>
    </div>
  );
}
