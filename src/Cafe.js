// Cafe.js
import React from 'react';
import './Location.css';

function Cafe({ characterData }) {
  const CafeStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/cafe.jpg)`
  };

  return (
    <div className="location-container" style={CafeStyle}>
      {/* 其他内容 */}
    </div>
  );
}

export default Cafe;