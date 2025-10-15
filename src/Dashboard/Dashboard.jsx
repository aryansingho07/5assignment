import './Dashboard.css';
import React, { useEffect, useState } from 'react';
import image from './downloads.png';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
  });
  const [displayPhoto, setDisplayPhoto] = useState(image);
  const [displayText, setDisplayText] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (storedUser) {
      setUser({
        username: storedUser.username,
        email: storedUser.email,
      });
    }

    const storedPhotoTextRaw = localStorage.getItem('photoTextData');
    if (storedPhotoTextRaw) {
      try {
        const storedPhotoText = JSON.parse(storedPhotoTextRaw);
        if (storedPhotoText && storedPhotoText.photo) {
          setDisplayPhoto(storedPhotoText.photo);
        }
        if (storedPhotoText && typeof storedPhotoText.text === 'string' && storedPhotoText.text.trim().length > 0) {
          setDisplayText(storedPhotoText.text.trim());
        }
      } catch (e) {
        localStorage.removeItem('photoTextData');
      }
    }
  }, []);

  return (
    <div className="Dashboard-headers">
      <div className="profile-title">
        <h3 className="Dashboard-head1">Account Settings</h3>
      </div>
      <div className="profile-section">
        <div className="profile-container">
          <div className="profile-pic-wrapper" onClick={() => navigate('/addphototext')}>
            <img src={displayPhoto} alt="Avatar" className="profile-image" />
            <i className="fa fa-camera camera-icon"></i>
          </div>

          <div className="profile-info">
            <p className="profile-name">{user.username}</p>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="Dashboard-para">
          <p>{displayText}</p>
          <div className="line" />
          <div className="lines" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
