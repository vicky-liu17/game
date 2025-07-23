// Gym.js
import React from 'react';
import './Location.css';

function Gym({ characterData }) {
  const GymStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/gym.jpg)`
  };

  return (
    <div className="location-container" style={GymStyle}>
      {/* 其他内容 */}
    </div>
  );
}

export default Gym;