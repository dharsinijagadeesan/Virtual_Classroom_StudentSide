import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LoginPage from './components/Login'; // Assuming LoginPage is located here
import LiveSessionPage from './components/LiveSessionPage';
import CoursesPage from './components/CoursesPage';
import CourseDetailsPage from './components/CourseDetailsPage';
import Assessments from './components/Assessments';
import GlobalPlatformAssessments from './components/GlobalPlatformAssessments';
import ViewProfile from './components/ViewProfile';
import StudentReportPage from './components/StudentReportPage';
import StudentAttendance from './components/StudentAttendance';
import DiscussionPage from './components/Discussions';
import AssessmentDetailsPage from './components/Assessmentdetailpage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const rollNo = localStorage.getItem('rollno');
  const teacherId = localStorage.getItem('teacherId');

  // Restore authentication state from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  // Function to handle login, passed to LoginPage to update authentication status
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist authentication status
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false'); // Clear authentication status
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/live-session" element={<LiveSessionPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/view-profile" element={<ViewProfile />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/global-platform" element={<GlobalPlatformAssessments />} />
              <Route path="/course/:courseCode" element={<CourseDetailsPage />} />
              <Route path="/reports" element={<StudentReportPage />} />
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route
                path="/discussions"
                element={<DiscussionPage teacherId={teacherId} loggedInStudent={rollNo} />}
              />
              <Route path="/assessment-details/:id" element={<AssessmentDetailsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
