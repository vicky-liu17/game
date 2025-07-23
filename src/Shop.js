// Shop.js
import React from 'react';
import './Location.css';

function Shop({ characterData }) {
  const shopStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/shop.jpg)`
  };

  return (
    <div className="location-container" style={shopStyle}>
      {/* 其他内容 */}
    </div>
  );
}

export default Shop;