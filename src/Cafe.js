// Cafe.js
import React, { useState, useEffect } from 'react';
import './Location.css';

function Cafe({ characterData, onAttributeChange }) {
  const [showGirl, setShowGirl] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [attributeIncreased, setAttributeIncreased] = useState(false);
  
  useEffect(() => {
    const randomValue = Math.random();
    const willShowGirl = randomValue < 0.5;
    setShowGirl(willShowGirl);
    
    // 添加淡入效果
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    // 只有当不显示女孩时，才增加金钱属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('金钱', 1);
      setAttributeIncreased(true);
    }
  }, []); // 空依赖数组确保效果只在组件挂载时运行一次
  
  const cafeStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.PUBLIC_URL}/images/Cafe.jpg)`
  };

  return (
    <div className="location-container" style={cafeStyle}>
      <div className="location-title">咖啡馆</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="library-text">
            你推开咖啡馆的玻璃门，风铃清脆地响了一声。
            晨间的阳光斜照在吧台上，咖啡机嗡鸣，奶泡壶冒着热气。
            <br /><br />
            你系好围裙，擦干净最后一个马克杯，开始今日的打工修行。
            你做了7杯拿铁，其中3杯拉花失败，被自己偷偷喝掉。
            你擦了12遍桌子，第4桌的客人留下了小费——硬币一枚。
            你听了17遍"今天天气真好"，并回复了17遍"您的美式好了"。
            <br /><br />
            老板娘结算了工资。
            你数了数零钱，硬币叮当作响——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>金钱+1</span>
          </p>
        ) : (
          <div className="girl-content">
            <p className="library-text">你好啊</p>
            <img 
              className="girl-image"
              src={`${process.env.PUBLIC_URL}/images/girl1.png`} 
              alt="Girl 1" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cafe;