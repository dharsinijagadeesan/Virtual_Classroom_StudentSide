import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LiveSessionPage.css';

function LiveSessionPage() {
  const [sessions, setSessions] = useState([]); // State for multiple sessions
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      const teacherId = localStorage.getItem('teacherId'); // Fetch teacherId from localStorage

      if (!teacherId) {
        setError('No teacherId found in localStorage.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/live-sessions/${teacherId}`);
        setSessions(response.data); // Set all sessions
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No live sessions found for your teacher.');
        } else {
          setError('An error occurred while fetching live session details.');
        }
      }
    };

    fetchLiveSessions();
  }, []);

  return (
    <div className="liveSession-main-content">
      <header className="liveSession-header">
        <h1>Live Sessions</h1>
        <p>Explore all the live sessions available for you to join and engage in real-time learning experiences.</p>
      </header>
      <div className="liveSession-sessions-list">
        <h2>All Live Sessions</h2>
        {error ? (
          <p className="liveSession-error-message" style={{ color: 'red' }}>{error}</p>
        ) : sessions.length > 0 ? (
          sessions.map((session, index) => (
            <div key={index} className="liveSession-session-details">
              <p><strong>Teacher:</strong> {session.name}</p>
              <p><strong>Time:</strong> {session.time}</p>
              <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
              <p><strong>Link:</strong> <a href={session.link} target="_blank" rel="noopener noreferrer">{session.link}</a></p>
            </div>
          ))
        ) : (
          <p>Loading live session details...</p>
        )}
      </div>
    </div>
  );
}

export default LiveSessionPage;
