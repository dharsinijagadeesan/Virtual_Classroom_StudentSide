import React from 'react';
import { useLocation } from 'react-router-dom';
import './Assessmentdetailpage.css';

const AssessmentDetailsPage = () => {
  const location = useLocation();
  const assessment = location.state; // Get assessment data passed from Assessments page

  if (!assessment) {
    return <p>No assessment data available.</p>;
  }

  return (
    <div className="assessment-details-page">
      <h1>{assessment.name}</h1>
      <img src={assessment.images}></img>
      <p><strong>Marks:</strong> {assessment.marks}</p>
      <p>
        <strong>Start:</strong> {new Date(assessment.startDate).toLocaleDateString()} - {assessment.startTime}
      </p>
      <p>
        <strong>End:</strong> {new Date(assessment.endDate).toLocaleDateString()} - {assessment.endTime}
      </p>
      <p><strong>Description:</strong> {assessment.description || 'No description available.'}</p>
    </div>
  );
};

export default AssessmentDetailsPage;