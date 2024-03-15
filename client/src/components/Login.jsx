import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3001';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(!newEmail ? 'Email is required' : '');
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(!newPassword ? 'Password is required' : '');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setEmailError(!email ? 'Email is required' : '');
    setPasswordError(!password ? 'Password is required' : '');

    if (email && password) {
      try {
        const response = await axios.post('/api/users/login', { email, password });

        if (response.status === 200) {
          setSubmitStatus('Login successful');
          // Redirect the user to another page or update UI as needed
        } else {
          setSubmitStatus('Invalid email or password');
        }
      } catch (error) {
        setSubmitStatus('An error occurred');
        console.error('An error occurred', error);
      }
    }
  };

  return (
    <div className="login-main row-fluid d-flex justify-content-center">
      <div className="col-md-3 text-center m-4">
        <div className="login-container">
          <h2 className="">Login</h2>
          <form className="form login-form" onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                type="text"
                id="email-login"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                id="password-login"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <div className="text-danger">{passwordError}</div>}
            </div>
            <div className="mb-3">
              <button className="btn btn-dark" type="submit">Login</button>
            </div>
          </form>
          {submitStatus && <div className="mt-3 alert alert-danger">{submitStatus}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
