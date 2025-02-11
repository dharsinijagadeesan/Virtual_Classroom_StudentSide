import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import './ViewProfile.css';

const ViewProfile = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    rollno: '',
    teacherId: '',
  });

  useEffect(() => {
    // Fetch user details from localStorage
    const name = localStorage.getItem('name');
    const rollno = localStorage.getItem('rollno');
    const teacherId = localStorage.getItem('teacherId');
    const email = localStorage.getItem('email');
    const address = localStorage.getItem('address');
    const department = localStorage.getItem('department');
    const section = localStorage.getItem('section');
    const year = localStorage.getItem('year');
    const phone = localStorage.getItem('phone');
    const className = localStorage.getItem('className');


    if (name && rollno && teacherId) {
      setUserDetails({ name, rollno, teacherId,email,address,department,section,year,phone,className });
    }
  }, []);

  return (
    <div className='profile-bg'>
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <FontAwesomeIcon icon={faUser} className="profile-icon" />
      <div className="profile-details">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Roll Number:</strong> {userDetails.rollno}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Address:</strong> {userDetails.address}</p>
        <p><strong>Phone number:</strong> {userDetails.phone}</p>
        <p><strong>Department:</strong> {userDetails.department}</p>
        <p><strong>Year of Study:</strong> {userDetails.year}</p>
        <p><strong>Section:</strong> {userDetails.section}</p>
        <p><strong>Class Name:</strong> {userDetails.className}</p>
        <p><strong>Teacher ID:</strong> {userDetails.teacherId}</p>
      </div>  
      </div>
    </div>
  );
};

export default ViewProfile;
