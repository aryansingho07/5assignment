import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addphototext.css';

const Addphototext = () => {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(''); // base64 data URL
  const [photoPreview, setPhotoPreview] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Prefill from localStorage if available for better editing UX
  useEffect(() => {
    try {
      const raw = localStorage.getItem('photoTextData');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.text === 'string') {
        setText(parsed.text);
      }
      if (parsed && typeof parsed.photo === 'string' && parsed.photo) {
        setPhoto(parsed.photo);
        setPhotoPreview(parsed.photo);
      }
    } catch (e) {
      // If invalid JSON, clear the key to restore defaults
      localStorage.removeItem('photoTextData');
    }
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setErrorMessage('');
    setSuccessMessage('');
    if (!file) {
      setPhoto('');
      setPhotoPreview('');
      return;
    }
    // Validate selected file is an image
    if (!file.type || !file.type.startsWith('image/')) {
      setPhoto('');
      setPhotoPreview('');
      setErrorMessage('Selected file is not an image. Please choose a valid image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPhoto(typeof base64 === 'string' ? base64 : '');
      setPhotoPreview(typeof base64 === 'string' ? base64 : '');
    };
    reader.readAsDataURL(file);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Helper to optionally downscale large images before saving
  const downscaleImageToMax = (dataUrl, maxWidth, maxHeight, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      try {
        const imageEl = new Image();
        imageEl.onload = () => {
          const ratio = Math.min(maxWidth / imageEl.width, maxHeight / imageEl.height, 1);
          const targetWidth = Math.round(imageEl.width * ratio);
          const targetHeight = Math.round(imageEl.height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(imageEl, 0, 0, targetWidth, targetHeight);
          // Prefer JPEG to reduce size if original is too large
          const output = canvas.toDataURL('image/jpeg', quality);
          resolve(output || dataUrl);
        };
        imageEl.onerror = () => resolve(dataUrl);
        imageEl.src = dataUrl;
      } catch (err) {
        resolve(dataUrl);
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const hasPhoto = Boolean(photo && photo.length > 0);
    const hasText = Boolean(text && text.trim().length > 0);

    if (!hasPhoto && !hasText) {
      setErrorMessage('Please add a photo or enter some text before submitting.');
      return;
    }

    let photoToSave = hasPhoto ? photo : '';

    // Attempt optional downscaling if image looks large (> 1.5MB as dataURL length heuristic)
    if (hasPhoto && photo.length > 1.5 * 1024 * 1024) {
      photoToSave = await downscaleImageToMax(photo, 1280, 1280, 0.8);
    }

    const payload = {
      photo: photoToSave,
      text: hasText ? text.trim() : ''
    };

    try {
      localStorage.setItem('photoTextData', JSON.stringify(payload));
      setSuccessMessage('Saved! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (e) {
      const message = (e && (e.name === 'QuotaExceededError' || e.code === 22))
        ? 'Image too large; please select a smaller image.'
        : 'Unable to save your data. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="apt-container">
      <h2 className="apt-heading">Add Photo & Text</h2>
      <form className="apt-form" onSubmit={handleSubmit}>
        <div className="apt-field">
          <label className="apt-label">Photo</label>
          <div className="apt-file-wrapper">
            <label htmlFor="photo-input" className="apt-file-button">Choose Image</label>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {photoPreview ? (
          <div className="apt-preview">
            <img src={photoPreview} alt="Preview" className="apt-preview-image" />
          </div>
        ) : null}

        <div className="apt-field">
          <label className="apt-label" htmlFor="text-input">Text</label>
          <textarea
            id="text-input"
            className="apt-textarea"
            placeholder="Write something about you..."
            rows="6"
            value={text}
            onChange={handleTextChange}
          />
        </div>

        {errorMessage ? <div className="apt-error">{errorMessage}</div> : null}
        {successMessage ? <div className="apt-success">{successMessage}</div> : null}

        <button type="submit" className="apt-submit">Save</button>
      </form>
    </div>
  );
};

export default Addphototext;