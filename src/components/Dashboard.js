import { useNavigate } from 'react-router-dom';
import success from '../sidebar-logos/image.png';
import './DashBoard.css';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const navigate=useNavigate();

  useEffect(() => {
    // Get the stored username from localStorage
    const storedUsername = localStorage.getItem('name');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  return (
    <div className="dashboard-container">

      {/* Navbar Section */}
      <div className="navbar-container">
        <h4 className="navbar-title">Welcome, {username || 'Guest'}.</h4>
        <button className="navbar-button" onClick={()=>navigate("/view-profile")}>View Profile</button>
      </div>

      {/* Global Profiles Section */}
      <div className="global-profiles-container">
        <h2 className="global-profile-section-title">Global Platform Profiles</h2>
        <div className='global-profile-top'>
          <div className="global-profile-card">
            <div className="global-profile-info">
              <img src={success} alt="Success Icon" className="global-profile-icon" />
              <p>Add your External Profile</p>
              <a href="#" className="global-profile-edit-link">Edit External Profile</a>
            </div>
          </div>
          <div className="global-profile-card" style={{marginLeft:'80px'}}>
            <div className="global-profile-info">
              <img src={success} alt="Success Icon" className="global-profile-icon" />
              <p>Add your External Profile</p>
              <a href="#" className="global-profile-edit-link">Edit External Profile</a>
            </div>
          </div>
        </div>
      </div>

      {/* ASSESSMENT ACTIVITY */}
      <div className="assessment-container">
      <div className="row">
        {/* Assessment Activity Section */}
        <div className="col-50">
          <h4 className="assessment-title">Assessment Activity</h4>
          <div className="row">
            <div className="col-50">
              <div className="card-custom">
                <h6 className="card-title">Tests Assigned</h6>
                <h2 className="card-value">4</h2>
              </div>
            </div>
            <div className="col-50">
              <div className="card-custom">
                <h6 className="card-title">Tests Completed</h6>
                <h2 className="card-value">0</h2>
              </div>
            </div>
            <div className="col-50">
              <div className="card-custom">
                <h6 className="card-title">Questions Attempted</h6>
                <h2 className="card-value">0</h2>
              </div>
            </div>
            <div className="col-50">
              <div className="card-custom">
                <h6 className="card-title">Total Time Spent</h6>
                <h2 className="card-value">0 mins</h2>
              </div>
            </div>
          </div>
          <p className="assessment-note">
            Please visit the <a href="#" className="assessment-link">Assessments page</a> for all the active assessments/assignments.
          </p>
        </div>

        {/* Subject Level Accuracy Section */}
        <div className="col-50">
          <h4 className="assessment-title">Subject Level Accuracy</h4>
          <p className="subject-level-description">
            This metric reflects your overall performance across all assessments taken, providing a summary of your accuracy at the subject level. It offers insights into how well you've performed in each subject area, helping you identify strengths and areas for improvement.
          </p>
          <div className="card-custom">
            <div className="subject-level">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="subject-level-header">Technical</span>
                <span className="subject-level-value">0%</span>
              </div>
              <div className="progress-bar-custom">
                <div
                  className="progress-fill"
                  style={{ width: '0%' }} // Dynamically setting the width
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sessions Section */}
      <div className="live-session-container">
        <h4 className="assessment-title">Live Sessions</h4>
        <p className="live-session-note">
          No live sessions are currently taking place, please check back later.
        </p>
      </div>
      </div>

      <div className="learning-container">
      {/* Learning Path Section */}
      <div className="learning-path-section">
        <h2 className="learning-path-section-title">Learning Path</h2>
        <div className="learning-path-cards">
          <div className="card path-card">
            <h3>KONGU | SUPER PACC | 2026</h3>
            <div className="goal-circle">
              <p>Goal</p>
              <p className="goal-percentage">26.4%</p>
            </div>
            <button className="view-btn">View learning path</button>
            <p>Modules: 0 out of 1</p>
          </div>
          <div className="card path-card">
            <h3>PaCC</h3>
            <div className="goal-circle">
              <p>Goal</p>
              <p className="goal-percentage">0.0%</p>
            </div>
            <button className="view-btn">View learning path</button>
            <p>Modules: 0 out of 1</p>
          </div>
        </div>
      </div>

      {/* Learning Now Section */}
      <div className="learning-now-section">
        <h2 className="learning-now-section-title">Learning Now</h2>
        <div className="learning-now-cards">
          <div className="card now-card">
            <h3>Problem Solving Using Data Structures</h3>
            <button className="view-btn">View Course</button>
          </div>
          <div className="card now-card">
            <h3>Problem Solving Using JAVA Programming</h3>
            <button className="view-btn">View Course</button>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Dashboard;
