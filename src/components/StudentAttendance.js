import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import './StudentAttendance.css';
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  LineController,
  LineElement,
  ArcElement, 
  PieController,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

// Register components
ChartJS.register(
  LineController,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement, 
  PieController,
  CategoryScale
);

const StudentAttendance = () => {
  const rollNo = localStorage.getItem('rollno');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [attendance, setAttendance] = useState(null);
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  
  // Fetch attendance for the selected date
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${rollNo}/${date}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Ensure data is an array and has at least one object
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Invalid or empty attendance data:', data);
        setAttendance(null);
        destroyChart();
        return;
      }

      const attendanceData = data[0]; // Extract the first object
      if (!attendanceData.attendance) {
        console.error('Attendance data is missing:', attendanceData);
        setAttendance(null);
        destroyChart();
        return;
      }

      setAttendance(attendanceData);

      const presentCount = attendanceData.attendance.filter((item) => item.status === 'Present').length;
      const absentCount = attendanceData.attendance.filter((item) => item.status === 'Absent').length;
      
      createChart(presentCount, absentCount);
    } catch (error) {
      console.error('Error fetching attendance:', error.message);
      setAttendance(null);
      destroyChart();
    }
  };

  // Create chart instance
  const createChart = (presentCount, absentCount) => {
    destroyChart(); // Destroy existing chart if any
  
    const ctx = canvasRef.current.getContext('2d');
    const gradientPresent = ctx.createLinearGradient(0, 0, 0, 400);
    gradientPresent.addColorStop(0, '#4caf50');
    gradientPresent.addColorStop(1, '#2e7d32');
  
    const gradientAbsent = ctx.createLinearGradient(0, 0, 0, 400);
    gradientAbsent.addColorStop(0, '#f44336');
    gradientAbsent.addColorStop(1, '#b71c1c');
  
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [
          {
            label: 'Attendance',
            data: [presentCount, absentCount],
            backgroundColor: [gradientPresent, gradientAbsent],
            borderWidth: 1,
            borderColor: '#fff',
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
            },
          },
        },
      },
    });
  };
  

  // Destroy chart instance
  const destroyChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  };

  useEffect(() => {
    if (rollNo) {
      fetchAttendance();
    }
  }, [rollNo, date]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => destroyChart();
  }, []);

  return (
    <div className="attendance-container">
      <h3 className="attendance-title">Student Attendance</h3>
      <div className="date-picker-container">
        <label htmlFor="date" className="date-label">
          Select Date:{' '}
        </label>
        <input
          type="date"
          id="date"
          className="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {attendance ? (
        <div className="attendance-table-container">
          <h4 className="attendance-heading">Attendance for {date}</h4>
          <p className="attendance-rollno">Roll Number: {rollNo}</p>
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="table-header">Period</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.attendance.map((item, index) => (
                <tr key={index}>
                  <td className="table-cell">{item.periodNumber}</td>
                  <td className="table-cell">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="loading-text">Loading attendance or no data available.</p>
      )}
      <div className="chart-container">
        <h4 className="chart-heading">Cumulative Attendance Visualization</h4>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default StudentAttendance;
