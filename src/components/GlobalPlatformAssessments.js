import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GlobalPlatformAssessments.css';

const GlobalPlatformAssessments = () => {
  const [platformAssessments, setPlatformAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformAssessments = async () => {
      setLoading(true);

      // Get teacherId from localStorage
      const teacherId = localStorage.getItem('teacherId');

      if (!teacherId) {
        setError('Teacher ID is not available.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/platforms/${teacherId}`);
        setPlatformAssessments(response.data);
      } catch (err) {
        console.error("Error fetching platform assessments:", err);
        setError("Failed to fetch platform assessments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformAssessments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="platform-page">
      <div className="platform-header">
      <h1 className="platform-heading">Global Platform Assessments</h1>
      <p className="platform-description">
        Global platform assessment is a systematic approach to evaluating students' learning and development on global platforms like LeetCode and HackerRank.
      </p>
      </div>
      <div className="platform-my-tests">
        {platformAssessments.length > 0 ? (
          platformAssessments.map((assessment) => (
            <div className="platform-test-card" key={assessment._id}>
              <h3>{assessment.name}</h3>
              <img src={assessment.image} alt={assessment.name} width='{40px}'/>
              <p>
                {new Date(assessment.startDate).toLocaleDateString()} {assessment.startTime} – {new Date(assessment.endDate).toLocaleDateString()} {assessment.endTime}
              </p>
              <button
                className="platform-challenge-button"
                onClick={() => window.open(assessment.link, '_blank')}
              >
                Go to challenge
              </button>
            </div>
          ))
        ) : (
          <p>No assessments available for this teacher.</p>
        )}
      </div>
    </div>
  );
};

export default GlobalPlatformAssessments;
