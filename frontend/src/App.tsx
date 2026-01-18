import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CreateStudyPage, StudyDetailPage } from './pages/studies';
import { CreateSessionPage, SessionDetailPage } from './pages/sessions';
import { Layout } from './components/layout';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes with header */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/studies/new" element={<CreateStudyPage />} />
        <Route path="/studies/:id" element={<StudyDetailPage />} />
        <Route path="/studies/:studyId/sessions/new" element={<CreateSessionPage />} />
        <Route path="/studies/:studyId/sessions/:sessionId" element={<SessionDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;