import './Register.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    phonenumber: '',
    email: '',
    password: '',
    companyname: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value
    }));
    const field = id || name;
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (successMessage) setSuccessMessage('');
  };

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhoneNumber = (phonenumber) => /^\d{10}$/.test(phonenumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, phonenumber, email, password, companyname } = formData;

    setErrors({});
    setSuccessMessage('');

    let hasError = false;
    const nextErrors = {};
    if (!username || !phonenumber || !email || !password || !companyname) {
      nextErrors.form = 'Please fill out all required fields.';
      hasError = true;
    }

    if (!validEmail(email)) {
      nextErrors.email = 'Invalid email address.';
      hasError = true;
    }

    if (!validPhoneNumber(phonenumber)) {
      nextErrors.phonenumber = 'Invalid phone number. Please enter a 10-digit number.';
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    localStorage.setItem("userData", JSON.stringify(formData));
    console.log('Form Data:', formData);
    setSuccessMessage('Form submitted successfully!');
    navigate('/login');
  };

  return (
    <div className="reg-headers">
      <h2 className="reg-head1">Create your PopX account</h2>

      <form className="reg" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="error-message" role="alert">{errors.form}</div>
        )}
        {successMessage && (
          <div className="success-message" role="status">{successMessage}</div>
        )}
        <div className="reginput">
          <label htmlFor="username" className="text">Full Name*</label>
          <input
            type="text"
            placeholder="Enter Your Name..."
            id="username"
            className="input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="reginput">
          <label htmlFor="phonenumber" className="text">Phone Number*</label>
          <input
            type="text"
            placeholder="Enter Your Phone Number..."
            id="phonenumber"
            className="input"
            value={formData.phonenumber}
            onChange={handleChange}
            required
          />
          {errors.phonenumber && (
            <div className="error-message field-error" role="alert">{errors.phonenumber}</div>
          )}
        </div>

       <div className="reginput">
         <label htmlFor="input" className="text">Email Address* </label> 
         <input type="text" placeholder="Enter Email Address..." id="email" className="input"  onChange={handleChange} value={formData.email} required/>
         {errors.email && (
           <div className="error-message field-error" role="alert">{errors.email}</div>
         )}
        </div> 

        <div className="reginput"> 
        <label htmlFor="input" className="text">Password* </label> 
        <input type="text" placeholder="Enter Your Password..." id="password" className="input"  onChange={handleChange} value={formData.password} required/> 
        </div>

        <div className="reginput">
          <label htmlFor="companyname" className="text">Company Name*</label>
          <input
            type="text"
            placeholder="Enter Your Company Name..."
            id="companyname"
            className="input"
            value={formData.companyname}
            onChange={handleChange}
            required
          />
        </div>

        <p>Are you an Agency?*</p>
        <div className="ratio">
          <input
            type="radio"
            id="yes"
            name="agency"

          />
          <label htmlFor="yes">Yes</label>
          <br />
          <input
            type="radio"
            id="no"
            name="agency"
          />
          <label htmlFor="no">No</label>
        </div>

        <div className="submit-form">
          <button className="reg-links" type="submit">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
