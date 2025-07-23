// Library.js
import React from 'react';
import './Location.css';

function Library({ characterData }) {
  const libraryStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/library.jpg)`
  };

  return (
    <div className="location-container" style={libraryStyle}>
      {/* 其他内容 */}
    </div>
  );
}

export default Library;
