// Library.js
import React, { useState, useEffect } from 'react';
import './Location.css';

function Library({ characterData, onAttributeChange }) {
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
    
    // 只有当不显示女孩时，才增加学识属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('学识', 1);
      setAttributeIncreased(true);
    }
  }, []); // 空依赖数组确保效果只在组件挂载时运行一次
  
  const libraryStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.PUBLIC_URL}/images/library.jpg)`
  };

  return (
    <div className="location-container" style={libraryStyle}>
      <div className="location-title">图书馆</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="library-text">
            你推开图书馆的大门，油墨与旧纸的气息扑面而来。
            晨光斜照在书架上，你选了个安静的角落坐下，摊开笔记，开始今日的修行。
            <br /><br />
            你读完了《中世纪欧洲农业史·下册》，窗外的麻雀叫了17次。
            你啃透了《线性代数习题集》，隔壁桌的情侣悄悄牵了手又松开。
            你抄写《古典哲学金句300条》，钢笔没水了，换了一支。
            <br /><br />
            你合上最后一本书，伸了个懒腰——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>学识+1</span>
          </p>
        ) : (
          <div className="girl-content">
            <p className="library-text">你好啊</p>
            <img 
              className="girl-image"
              src={`${process.env.PUBLIC_URL}/images/girl2.png`} 
              alt="Girl 2" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;