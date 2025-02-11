import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faGlobe, faBook, faVideo, faSignOutAlt, faBarsProgress, faComments, faCommentSms, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import logo from '../components/logo-learnlab.png';

function Sidebar() {
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  }
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
      
      <img src={logo} alt="logo" height="60px" width="180px"/>
      </div>
      <nav className="sidebar-menu">
        <Link to="/dashboard" className="menu-item">
          Dashboard
          <FontAwesomeIcon icon={faHome} className="menu-icon" />
        </Link>
        <Link to="/assessments" className="menu-item">
          Assessments
          <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
        </Link>
        <Link to="/global-platform" className="menu-item">
          Global Platform Assessments
          <FontAwesomeIcon icon={faGlobe} className="menu-icon" />
        </Link>
        <Link to="/courses" className="menu-item ">
          Courses
          <FontAwesomeIcon icon={faBook} className="menu-icon" />
        </Link>
        <Link to="/live-session" className="menu-item ">
          Live Session
          <FontAwesomeIcon icon={faVideo} className="menu-icon" />
        </Link>
        <Link to="/reports" className="menu-item ">
          Student Report
          <FontAwesomeIcon icon={faBarsProgress} className="menu-icon" />
        </Link>
        <Link to="/attendance" className="menu-item ">
          Track Attendance
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
        </Link>
        <Link to="/discussions" className="menu-item ">
          Discussions
          <FontAwesomeIcon icon={faUsers} className='menu-icon'/>
        </Link>
        
        <Link to="/login" className="menu-item">
        <button class="noselect" onClick={handleLogout} className='sidebar-logout'><span class="text">Logout</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
