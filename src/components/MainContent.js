import React from 'react';
import Header from './Header';
import './MainContent.css';

function MainContent() {
  return (
    <div className="main-content">
      <Header />
      <div className="sessions-list">
        <h2>All Live Sessions</h2>
        <p>No live sessions are currently taking place, please check back later.</p>
      </div>
    </div>
  );
}

export default MainContent;
