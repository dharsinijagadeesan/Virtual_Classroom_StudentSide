import React, { useState, useEffect } from 'react';
import './CoursesPage.css';
import { Link } from 'react-router-dom';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [courseIdInput, setCourseIdInput] = useState('');
  const [error, setError] = useState('');
  
  // Fetch all joined courses on component mount
  useEffect(() => {
    fetchJoinedCourses();
  }, []);

  const fetchJoinedCourses = async () => {
    try {
      // Assuming you have the student's ID stored in localStorage after login
      const studentId = localStorage.getItem('rollno');
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Failed to load your courses');
    }
  };
  
  const handleJoinClass = async () => {
    if (!courseIdInput.trim()) {
      setError('Please enter a valid Course ID.');
      return;
    }
    try {
      const studentId = localStorage.getItem('rollno');
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/join-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: courseIdInput }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join course');
      }
      
      // Refresh the courses list after successfully joining
      await fetchJoinedCourses();
      setCourseIdInput('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="course-main-content">
      <header className="course-header">
        <h1>Courses</h1>
        <p>Step up and skill up! Interact live with passionate practitioners, learn without limits, and bloom your dreams.</p>
      </header>
      <div className="join-class-section">
        <input
          type="text"
          placeholder="Enter Course ID"
          value={courseIdInput}
          onChange={(e) => setCourseIdInput(e.target.value)}
        />
        <button onClick={handleJoinClass}>Join Class</button>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="courses-section">
        <h2>Learning Now</h2>
        <div className="courses-list">
          {courses.map(course => (
            <div className="course-card" key={course.courseId}>
              <div className="course-image">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p>{course.courseName}</p>
                <p><strong>Course ID:</strong> {course.courseId}</p>
                <Link to={`/course/${course.courseId}`}>
                  <button className="course-btn">Explore More</button>
                </Link>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p>You haven't joined any courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;