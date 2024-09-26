import React, { useState } from 'react';
import axios from 'axios';

const UploadComponent = () => {
  const [selectedSize, setSelectedSize] = useState('A4');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState(''); // State to hold user input text
  const [textPosition, setTextPosition] = useState('top'); // State to hold text position

  // Size options and their corresponding dimensions
  const sizeOptions = {
    A4: { width: '210mm', height: '297mm' },
    'Half A4': { width: '148mm', height: '210mm' },
    BigSize: { width: '297mm', height: '420mm' },
    Pamphlet: { width: '100mm', height: '210mm' },
  };

  // Function to handle size change
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!imageFile || !selectedSize) {
      alert('Please upload an image and select a size.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('size', selectedSize);
    formData.append('text', text); // Add the text to the form data
    formData.append('textPosition', textPosition); // Add text position to the form data

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image, size, and text saved successfully!');
    } catch (error) {
      alert('Failed to save image, size, and text.');
    }
  };

  return (
    <div className="UploadComponent">
      <h1>Select Paper Size & Upload File</h1>

      <div className="indicator-menu">
        {Object.keys(sizeOptions).map((size) => (
          <button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`indicator-button ${selectedSize === size ? 'active' : ''}`}
          >
            {size}
          </button>
        ))}
      </div>

      <input type="file" accept="image/*" onChange={handleFileUpload} />

      {/* Text Input */}
      <div className="text-input">
        <label htmlFor="text">Add Text:</label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here"
        />
      </div>

      {/* Text Position Selector */}
      <div className="text-position">
        <label>Text Position:</label>
        <select
          value={textPosition}
          onChange={(e) => setTextPosition(e.target.value)}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      <div
        className="paper"
        style={{
          width: sizeOptions[selectedSize].width,
          height: sizeOptions[selectedSize].height,
          border: '1px solid black',
          margin: '20px auto',
          position: 'relative',
        }}
      >
        {/* Display uploaded image inside the paper area */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              position: 'absolute', 
              top: 0, 
              left: 0 
            }}
          />
        )}

        {/* Display text at top or bottom based on user selection */}
        {text && (
          <div
            style={{
              position: 'absolute',
              [textPosition]: '10px', // Top or bottom position
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)', // Background to make the text visible on images
              padding: '5px',
            }}
          >
            {text}
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        {selectedSize} Paper
      </p>

      <button onClick={handleSubmit} style={{ display: 'block', margin: '20px auto' }}>
        Save {selectedSize}, Upload Image, and Add Text
      </button>
    </div>
  );
};

export default UploadComponent;
