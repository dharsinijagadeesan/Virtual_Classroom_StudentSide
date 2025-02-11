import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo-learnlab.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Phone:", phone);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        localStorage.setItem('rollno', data.rollno);
        localStorage.setItem('teacherId', data.teacherId);
        localStorage.setItem('name',data.name);
        localStorage.setItem('address',data.address);
        localStorage.setItem('email',data.email);
        localStorage.setItem('phone',data.phone);
        localStorage.setItem('section',data.section);
        localStorage.setItem('department',data.department);
        localStorage.setItem('year',data.year);
        localStorage.setItem('className',data.className);

        console.log(data.rollno,data.teacherId,data.name,data.address,data.mail,data.phone,data.section,data.department,data.year,data.className);
        onLogin();   
        navigate('/dashboard'); 

      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error:", error);
      setError('Server error in login page');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className='right-section'>
      <div className='login-logo'><img src={Logo} width={280} height={100} alt="logo"/></div>
      <div className="login-form" width={700} height={300}> 
        <h2>LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Password:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Enter your password'
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;