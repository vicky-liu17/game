// Gym.js
import React, { useState, useEffect } from 'react';
import './Location.css';

function Gym({ characterData, onAttributeChange }) {
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

    // 只有当不显示女孩时，才增加体能属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('体能', 1);
      setAttributeIncreased(true);
    }
  }, []); // 空依赖数组确保效果只在组件挂载时运行一次
  
  const gymStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.PUBLIC_URL}/images/gym.jpg)`
  };

  return (
    <div className="location-container" style={gymStyle}>
      <div className="location-title">健身房</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="gym-text">
            你踏入健身房，熟悉的运动气息迎面扑来。
            今天的训练计划已在脑中成型，你活动了一下筋骨，开始了锻炼。
            <br /><br />
            你完成了三组深蹲，汗水浸透了背部。
            你坚持了最后一组卧推，肌肉的酸痛感如潮水般袭来。
            在跑步机上，你跑完了计划的5公里，呼吸渐渐平稳。
            <br /><br />
            离开健身房时，你感到身体更加轻盈有力——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>体能+1</span>
          </p>
        ) : (
          <div className="girl-content">
            <p className="gym-text">嗨，需要我帮你指导训练吗？</p>
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

export default Gym;