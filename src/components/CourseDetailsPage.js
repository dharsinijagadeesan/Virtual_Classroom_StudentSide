import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CourseDetailsPage.css';

function CourseDetailsPage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseCode) {
      setError('Course Code is missing or invalid.');
      setLoading(false);
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/code/${courseCode}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseCode]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="course-details">
      {course ? (
        <>
          <h1>{course.title}</h1>
          <p>{course.courseName}</p>
          {course.image && <img src={course.image} alt={course.title} />}
          <h3>Course Contents</h3>
          <ul>
            {course.contents.map((content, index) => {
              if (typeof content === 'string') {
                // Handle string content
                return <li key={index}>{content}</li>;
              } else if (Array.isArray(content)) {
                // Handle array content
                return (
                  <li key={index}>
                    <strong>Subtopics:</strong>
                    <ul>
                      {content.map((subContent, subIndex) => (
                        <li key={subIndex}>{subContent}</li>
                      ))}
                    </ul>
                  </li>
                );
              } else {
                return null; // Skip invalid types
              }
            })}
          </ul>
        </>
      ) : (
        <p>Course details not found.</p>
      )}
    </div>
  );
}

export default CourseDetailsPage;
