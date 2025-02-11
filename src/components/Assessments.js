import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Assessments.css';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('All assessments');
  const teacherId = localStorage.getItem('teacherId'); // Get teacherId from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        if (teacherId) {
          const response = await axios.get(`http://localhost:5000/api/assessments/teacher/${teacherId}`);
          setAssessments(response.data);
          setFilteredAssessments(response.data); // Default filter to all assessments
        } else {
          console.error('Teacher ID not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, [teacherId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    const now = new Date();

    switch (tab) {
      case 'Upcoming assessments':
        setFilteredAssessments(
          assessments.filter((assessment) => new Date(assessment.startDate) > now)
        );
        break;
      case 'Attempted assessments':
        // Filter logic for attempted assessments (placeholder)
        setFilteredAssessments([
           
        ]); // Update with your backend implementation
        break;
      case 'Unattempted assessments':
        // Filter logic for unattempted assessments (placeholder)
        setFilteredAssessments([
          
        ]); // Update with your backend implementation
        break;
      case 'All assessments':
         
      default:
        setFilteredAssessments(assessments);
        break;
    }
  };

  const handleTakeTest = (assessment) => {
    navigate(`/assessment-details/${assessment._id}`, { state: assessment }); // Pass assessment data to new page
  };

  return (
    <div className="assessments-page">
      <div className="assessments-header">
      <h1 className="heading">Assessments</h1>
      <p className="description">
        Assessment is the systematic basis for making inferences about the learning and development of students. Let's redefine your experience with our continued assessments.
      </p>
      </div>
      <div className="tabs">
        <button
          className="tab"
          onClick={() => handleTabClick('Upcoming assessments')}
        >
          Upcoming assessments
        </button>
        <button
          className="tab"
          onClick={() => handleTabClick('Attempted assessments')}
        >
          Attempted assessments
        </button>
        <button
          className="tab"
          onClick={() => handleTabClick('Unattempted assessments')}
        >
          Unattempted assessments
        </button>
        <button
          className="tab"
          onClick={() => handleTabClick('All assessments')}
        >
          All assessments
        </button>
      </div>
      <div className="assessment-container">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment) => (
            <div key={assessment._id} className="assessment-box">
              <div className="assessment-header">
                <p>{assessment.name}</p>
              </div>
              <div className="assessment-actions">
                <strong>Start:</strong> {new Date(assessment.startDate).toLocaleDateString()} - {assessment.startTime}<br />
                <strong>End:</strong> {new Date(assessment.endDate).toLocaleDateString()} - {assessment.endTime}<br />
                <strong>Marks:</strong> {assessment.marks}
                <center>
                  <button
                    className="take-test-button"
                    onClick={() => handleTakeTest(assessment)}
                  >
                    Take Test
                  </button>
                </center>
              </div>
            </div>
          ))
        ) : (
          <p>No assessments available.</p>
        )}
      </div>
    </div>
  );
};

export default Assessments;
